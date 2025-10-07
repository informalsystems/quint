import fs from 'fs/promises'
import { resolve } from 'path'
import { getPageMap } from 'nextra/page-map'
import { normalizePages } from 'nextra/normalize-pages'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkStringify from 'remark-stringify'
import { visit } from 'unist-util-visit'

function remarkUnwrapJsx() {
  return tree => {
    visit(tree, ['mdxJsxFlowElement', 'mdxjsEsm'], (node, index, parent) => {
      if (node.type === 'mdxJsxFlowElement' && node.children && node.children.length > 0) {
        parent.children.splice(index, 1, ...node.children)
        return [visit.SKIP, index]
      } else {
        parent.children.splice(index, 1)
        return [visit.SKIP, index]
      }
    })
  }
}

async function extractMarkdown(dir: any, md: string[]) {
  if (dir.type !== 'doc') return // not a md or mdx file
  if (dir.children) {
    for (const child of dir.children) {
      await extractMarkdown(child, md)
    }
  } else {
    if (!dir.frontMatter) return
    const path = resolve(process.cwd(), dir.frontMatter.filePath)
    const content = await fs.readFile(path)

    if (path.endsWith('.mdx')) {
      const file = await unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(remarkUnwrapJsx)
        .use(remarkStringify)
        .process(content)

      md.push(String(file))
    } else {
      md.push(content)
    }
  }
}

export async function GET() {
  const { directories } = normalizePages({
    list: await getPageMap('/docs'),
    route: '/docs',
  })

  let md = ['# Quint Language Documentation']
  for (const dir of directories) {
    await extractMarkdown(dir, md)
  }

  return new Response(md.join('\n\n'), { 'Content-Type': 'text/markdown' })
}
