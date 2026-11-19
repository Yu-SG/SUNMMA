/**
 * 注入 JSON-LD 结构化数据。传入函数以便随内容变化重新生成。
 */
export const useJsonLd = (
  id: string,
  build: () => Record<string, unknown> | null,
) => {
  useHead(() => {
    const data = build()
    if (!data) return {}

    return {
      script: [
        {
          key: `jsonld-${id}`,
          type: 'application/ld+json',
          innerHTML: JSON.stringify(data),
        },
      ],
    }
  })
}
