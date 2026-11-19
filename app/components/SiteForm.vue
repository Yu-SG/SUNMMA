<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { SiteFormField, SiteFormsPage } from '#shared/site'

const props = defineProps<{
  page: SiteFormsPage
  type: 'contact' | 'pharmacovigilance'
}>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }>; reset: () => void } | null>(null)
const submitting = ref(false)
const success = ref(false)
const errorMessage = ref('')

const values = reactive<Record<string, string>>(
  Object.fromEntries(props.page.fields.map((field) => [field.name, ''])),
)

const iconMap: Record<string, string> = {
  name: 'mdi-account-outline',
  phone: 'mdi-phone-outline',
  company: 'mdi-office-building-outline',
  email: 'mdi-email-outline',
  topic: 'mdi-tag-outline',
  message: 'mdi-message-text-outline',
  reporter: 'mdi-account-question-outline',
  drugName: 'mdi-pill',
  reaction: 'mdi-alert-circle-outline',
}

const rulesFor = (field: SiteFormField) => {
  const rules: Array<(value: unknown) => true | string> = []
  if (field.required) {
    rules.push((value) =>
      (typeof value === 'string' && value.trim().length > 0) || `请填写${field.label}`,
    )
  }
  if (field.type === 'email') {
    rules.push(
      (value) =>
        !value ||
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value)) ||
        '请输入有效的电子邮箱',
    )
  }
  if (field.type === 'tel') {
    rules.push(
      (value) =>
        !value ||
        /^[+\d][\d\s\-()]{5,19}$/.test(String(value)) ||
        '请输入有效的联系电话',
    )
  }
  return rules
}

const submit = async () => {
  errorMessage.value = ''
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  const fields: Record<string, string> = {}
  for (const field of props.page.fields) {
    const value = (values[field.name] ?? '').trim()
    if (value) fields[field.name] = value
  }

  submitting.value = true
  try {
    await $fetch('/api/forms', {
      method: 'POST',
      body: { type: props.type, fields },
    })
    success.value = true
  } catch (error: unknown) {
    const err = error as { data?: { statusMessage?: string; message?: string } }
    errorMessage.value =
      err?.data?.statusMessage || err?.data?.message || '提交失败，请稍后重试，或直接致电我们。'
  } finally {
    submitting.value = false
  }
}

const restart = () => {
  success.value = false
  errorMessage.value = ''
  formRef.value?.reset()
  for (const field of props.page.fields) values[field.name] = ''
}
</script>

<template>
  <div class="site-form">
    <v-expand-transition>
      <v-alert
        v-if="success"
        type="success"
        variant="tonal"
        rounded="xl"
        class="form-success"
        icon="mdi-check-circle-outline"
      >
        <h3 class="form-success__title">提交成功</h3>
        <p class="form-success__text">
          我们已收到你的信息，相关同事会在 2 个工作日内与你联系。感谢你的信任。
        </p>
        <div class="form-success__actions">
          <v-btn color="success" variant="flat" to="/">返回首页</v-btn>
          <v-btn variant="text" @click="restart">再次填写</v-btn>
        </div>
      </v-alert>
    </v-expand-transition>

    <template v-if="!success">
      <v-form ref="formRef" class="form-body" @submit.prevent="submit">
        <v-row density="compact">
          <v-col
            v-for="field in page.fields"
            :key="field.name"
            cols="12"
            :md="field.type === 'textarea' ? 12 : 6"
          >
            <v-select
              v-if="field.type === 'select'"
              v-model="values[field.name]"
              :items="field.options ?? []"
              :label="field.label"
              :placeholder="field.placeholder"
              :rules="rulesFor(field)"
              :prepend-inner-icon="iconMap[field.name]"
              clearable
              hide-details="auto"
              class="form-field"
            />
            <v-textarea
              v-else-if="field.type === 'textarea'"
              v-model="values[field.name]"
              :label="field.label"
              :placeholder="field.placeholder"
              :rules="rulesFor(field)"
              :maxlength="1000"
              counter
              rows="4"
              auto-grow
              hide-details="auto"
              class="form-field"
            />
            <v-text-field
              v-else
              v-model="values[field.name]"
              :label="field.label"
              :placeholder="field.placeholder"
              :type="field.type"
              :rules="rulesFor(field)"
              :prepend-inner-icon="iconMap[field.name]"
              :maxlength="120"
              hide-details="auto"
              class="form-field"
            />
          </v-col>
        </v-row>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-5"
        >
          {{ errorMessage }}
        </v-alert>

        <div class="form-actions">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="submitting"
            append-icon="mdi-send-outline"
          >
            提交
          </v-btn>
          <span class="form-hint">带 * 为必填项</span>
        </div>
      </v-form>

      <p class="form-footnote">
        <v-icon icon="mdi-lock-outline" size="14" />
        <span>{{ page.note }}</span>
      </p>
    </template>
  </div>
</template>

<style scoped>
.form-body {
  margin-top: 6px;
}

.form-field :deep(.v-field__input) {
  font-size: 14.5px;
}

.form-actions {
  display: flex;
  margin-top: 26px;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.form-hint {
  color: #7b8794;
  font-size: 12.5px;
}

.form-footnote {
  display: flex;
  margin-top: 22px;
  padding-top: 16px;
  align-items: flex-start;
  gap: 8px;
  border-top: 1px dashed rgba(16, 35, 58, 0.12);
  color: #7b8794;
  font-size: 12.5px;
  line-height: 1.8;
}

.form-success {
  padding: 28px;
}

.form-success__title {
  color: #1b5e20;
  font-size: 20px;
  font-weight: 600;
}

.form-success__text {
  margin-top: 8px;
  color: #33513a;
  font-size: 14px;
  line-height: 1.9;
}

.form-success__actions {
  display: flex;
  margin-top: 20px;
  gap: 8px;
}
</style>
