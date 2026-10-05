import { RESUME_PAGE } from '../templates/resumeGeometry.ts';

interface LayoutNode {
  type: string;
  box?: { top: number; left: number; width: number; height: number };
  lines?: Array<{ box: { y: number; height: number } }>;
  children?: LayoutNode[];
}

/** Reject overflow rather than delivering clipped text or unplanned pages. */
export function assertResumePdfLayoutFits(layout: LayoutNode, expectedPages: number) {
  const pages = layout.children || [];
  if (pages.length !== expectedPages) {
    throw new Error('Resume PDF pagination overflowed. Shorten the content in the overflowing section.');
  }
  for (const [pageIndex, page] of pages.entries()) {
    for (const [columnIndex, column] of (page.children || []).entries()) {
      const bottomInset = pageIndex === 0 ? (columnIndex === 0 ? RESUME_PAGE.top : RESUME_PAGE.primaryBottom) : RESUME_PAGE.secondaryBottom;
      const bottom = RESUME_PAGE.height - bottomInset;
      const visit = (node: LayoutNode, parentTop: number) => {
        const top = parentTop + (node.box?.top || 0);
        const textHeight = node.lines?.reduce((height, line) => Math.max(height, line.box.y + line.box.height), 0) || node.box?.height || 0;
        if (node.type === 'TEXT' && node.box && (top < RESUME_PAGE.top - 0.1 || top + textHeight > bottom + 0.1)) {
          throw new Error(`Resume content exceeds the printable area on page ${pageIndex + 1}. Shorten that page's content before exporting.`);
        }
        for (const child of node.children || []) visit(child, top);
      };
      visit(column, 0);
    }
  }
}
