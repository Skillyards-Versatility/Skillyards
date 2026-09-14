/**
 * Fixes remaining FAQ components that weren't patched in the first pass.
 * Run: node tmp/fix-remaining.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const fixes = [
  // ── ProgramsFAQ: has panel IDs but still button > h3 ──
  {
    file: "apps/website/src/components/programspage/ProgramsFAQ.jsx",
    search: `<button\n                  onClick={() => setOpenIndex(isOpen ? null : idx)}\n                  className="flex w-full items-center justify-between p-5 text-left"\n                >\n                  <h3 className={\`text-base font-bold transition-colors \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                    {faq.question}\n                  </h3>\n                  <div\n                    className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}\n                  >\n                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}\n                  </div>\n                </button>`,
    replace: `<h3 className="m-0">\n                  <button\n                    id={\`faq-trigger-\${idx}\`}\n                    type="button"\n                    aria-expanded={isOpen}\n                    aria-controls={\`faq-panel-\${idx}\`}\n                    onClick={() => setOpenIndex(isOpen ? null : idx)}\n                    className="flex w-full items-center justify-between p-5 text-left"\n                  >\n                    <span className={\`text-base font-bold transition-colors \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                      {faq.question}\n                    </span>\n                    <span\n                      className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}\n                    >\n                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}\n                    </span>\n                  </button>\n                </h3>`,
  },

  // ── FAQSection: has panel IDs but still button > h3 ──
  {
    file: "apps/website/src/components/common/FAQSection.jsx",
    search: `<button\n                  onClick={() => setOpenIndex(isOpen ? null : idx)}\n                  className="w-full flex justify-between items-center p-6 text-left"\n                >\n                  <h3\n                    className={\`text-lg font-bold transition-colors \${isOpen ? "text-primary" : "text-foreground"} m-0\`}\n                  >\n                    {faq.question}\n                  </h3>\n\n                  <div\n                    className={\`shrink-0 ml-4 p-2 rounded-full transition-transform duration-300 \${isOpen ? "bg-primary text-primary-foreground rotate-0" : "bg-muted text-muted-foreground rotate-90"}\`}\n                  >\n                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}\n                  </div>\n                </button>`,
    replace: `<h3 className="m-0">\n                  <button\n                    id={\`faq-trigger-\${idx}\`}\n                    type="button"\n                    aria-expanded={isOpen}\n                    aria-controls={\`faq-panel-\${idx}\`}\n                    onClick={() => setOpenIndex(isOpen ? null : idx)}\n                    className="w-full flex justify-between items-center p-6 text-left"\n                  >\n                    <span\n                      className={\`text-lg font-bold transition-colors \${isOpen ? "text-primary" : "text-foreground"}\`}\n                    >\n                      {faq.question}\n                    </span>\n\n                    <span\n                      className={\`shrink-0 ml-4 p-2 rounded-full transition-transform duration-300 \${isOpen ? "bg-primary text-primary-foreground rotate-0" : "bg-muted text-muted-foreground rotate-90"}\`}\n                    >\n                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}\n                    </span>\n                  </button>\n                </h3>`,
  },

  // ── TestFAQ: STILL has button > h3 AND needs panel IDs ──
  {
    file: "apps/website/src/components/testpage/TestFAQ.jsx",
    search: `<button\n                                    onClick={() => setOpen(isOpen ? null : i)}\n                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"\n                                >\n                                    <h3 className={\`text-sm font-bold leading-snug transition-colors \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                                        {faq.question}\n                                    </h3>\n                                    <div className={\`shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                                        {isOpen ? <Minus size={13} /> : <Plus size={13} />}\n                                    </div>\n                                </button>`,
    replace: `<h3 className="m-0">\n                                    <button\n                                        id={\`faq-trigger-\${i}\`}\n                                        type="button"\n                                        aria-expanded={isOpen}\n                                        aria-controls={\`faq-panel-\${i}\`}\n                                        onClick={() => setOpen(isOpen ? null : i)}\n                                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"\n                                    >\n                                        <span className={\`text-sm font-bold leading-snug transition-colors \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                                            {faq.question}\n                                        </span>\n                                        <span className={\`shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                                            {isOpen ? <Minus size={13} /> : <Plus size={13} />}\n                                        </span>\n                                    </button>\n                                </h3>`,
  },
  {
    file: "apps/website/src/components/testpage/TestFAQ.jsx",
    search: `<p className=\"px-5 pb-5 text-sm leading-relaxed text-muted-foreground\">`,
    replace: `<div\n                                            id={\`faq-panel-\${i}\`}\n                                            role=\"region\"\n                                            aria-labelledby={\`faq-trigger-\${i}\`}\n                                        >\n                                            <p className=\"px-5 pb-5 text-sm leading-relaxed text-muted-foreground\">`,
  },
  // Close the div for TestFAQ
  {
    file: "apps/website/src/components/testpage/TestFAQ.jsx",
    search: `{isOpen && (\n                                    <p className=\"px-5 pb-5 text-sm leading-relaxed text-muted-foreground\">\n                                        {faq.answer}\n                                    </p>`,
    replace: `{isOpen && (\n                                    <div\n                                        id={\`faq-panel-\${i}\`}\n                                        role="region"\n                                        aria-labelledby={\`faq-trigger-\${i}\`}\n                                    >\n                                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">\n                                            {faq.answer}\n                                        </p>\n                                    </div>`,
  },

  // ── SupportFAQ: still has button > h3 AND needs panel IDs ──
  {
    file: "apps/website/src/components/supportpage/SupportFAQ.jsx",
    search: `<button\n                                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}\n                                    className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left"\n                                >\n                                    <h3 className={\`text-sm sm:text-base font-bold leading-snug transition-colors \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                                        {faq.question}\n                                    </h3>\n                                    <div className={\`shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                                        {isOpen ? <Minus size={13} /> : <Plus size={13} />}\n                                    </div>\n                                </button>`,
    replace: `<h3 className="m-0">\n                                    <button\n                                        id={\`faq-trigger-\${idx}\`}\n                                        type="button"\n                                        aria-expanded={isOpen}\n                                        aria-controls={\`faq-panel-\${idx}\`}\n                                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}\n                                        className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left"\n                                    >\n                                        <span className={\`text-sm sm:text-base font-bold leading-snug transition-colors \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                                            {faq.question}\n                                        </span>\n                                        <span className={\`shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                                            {isOpen ? <Minus size={13} /> : <Plus size={13} />}\n                                        </span>\n                                    </button>\n                                </h3>`,
  },
  {
    file: "apps/website/src/components/supportpage/SupportFAQ.jsx",
    search: `<motion.div\n                                            initial={{ height: 0, opacity: 0 }}\n                                            animate={{ height: "auto", opacity: 1 }}\n                                            exit={{ height: 0, opacity: 0 }}\n                                            transition={{ duration: 0.25, ease: "easeInOut" }}\n                                        >`,
    replace: `<motion.div\n                                            id={\`faq-panel-\${idx}\`}\n                                            role="region"\n                                            aria-labelledby={\`faq-trigger-\${idx}\`}\n                                            initial={{ height: 0, opacity: 0 }}\n                                            animate={{ height: "auto", opacity: 1 }}\n                                            exit={{ height: 0, opacity: 0 }}\n                                            transition={{ duration: 0.25, ease: "easeInOut" }}\n                                        >`,
  },

  // ── FSD: has correct heading, still needs panel IDs ──
  {
    file: "apps/website/src/components/landingPageFSD/FAQ.jsx",
    search: `<motion.div\n                          initial={{ height: 0, opacity: 0 }}\n                          animate={{ height: "auto", opacity: 1 }}\n                          exit={{ height: 0, opacity: 0 }}\n                          transition={{ duration: 0.25, ease: "easeInOut" }}\n                        >`,
    replace: `<motion.div\n                          id={\`faq-panel-\${idx}\`}\n                          role="region"\n                          aria-labelledby={\`faq-trigger-\${idx}\`}\n                          initial={{ height: 0, opacity: 0 }}\n                          animate={{ height: "auto", opacity: 1 }}\n                          exit={{ height: 0, opacity: 0 }}\n                          transition={{ duration: 0.25, ease: "easeInOut" }}\n                        >`,
  },

  // ── DGM: has correct heading, still needs panel IDs ──
  {
    file: "apps/website/src/components/landingPageDGM/FAQ.jsx",
    search: `<motion.div\n                          initial={{ height: 0, opacity: 0 }}\n                          animate={{ height: "auto", opacity: 1 }}\n                          exit={{ height: 0, opacity: 0 }}\n                          transition={{ duration: 0.25, ease: "easeInOut" }}\n                        >`,
    replace: `<motion.div\n                          id={\`faq-panel-\${idx}\`}\n                          role="region"\n                          aria-labelledby={\`faq-trigger-\${idx}\`}\n                          initial={{ height: 0, opacity: 0 }}\n                          animate={{ height: "auto", opacity: 1 }}\n                          exit={{ height: 0, opacity: 0 }}\n                          transition={{ duration: 0.25, ease: "easeInOut" }}\n                        >`,
  },
];

let ok = 0,
  fail = 0;

for (const fix of fixes) {
  const fullPath = path.join(ROOT, fix.file);
  let content = fs.readFileSync(fullPath, "utf8");
  if (content.includes(fix.search)) {
    content = content.replace(fix.search, fix.replace);
    fs.writeFileSync(fullPath, content);
    console.log(`  ✓ ${fix.file}`);
    ok++;
  } else {
    console.log(`  ✗ ${fix.file}`);
    fail++;
  }
}

console.log(`\n${ok} OK, ${fail} failed`);
