/**
 * Fixes heading-inside-button HTML pattern across all FAQ components.
 * Run: node tmp/fix-faq-html.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Each entry: [file, [search, replace][]]
const fixes = [
  // ── BCA FAQ ──
  [
    "apps/website/src/components/landingPageBCA/FAQ.jsx",
    [
      [
        `<button\n                  onClick={() => setOpenIndex(isOpen ? null : idx)}\n                  className="flex w-full items-center justify-between p-5 text-left"\n                >\n                  <h3 className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                    {faq.question}\n                  </h3>\n                  <div className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                  </div>\n                </button>`,
        `<h3 className="m-0">\n                  <button\n                    id={\`faq-trigger-\${idx}\`}\n                    type="button"\n                    aria-expanded={isOpen}\n                    aria-controls={\`faq-panel-\${idx}\`}\n                    onClick={() => setOpenIndex(isOpen ? null : idx)}\n                    className="flex w-full items-center justify-between p-5 text-left"\n                  >\n                    <span className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                      {faq.question}\n                    </span>\n                    <span className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                    </span>\n                  </button>\n                </h3>`,
      ],
      [
        `<motion.div\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
        `<motion.div\n                      id={\`faq-panel-\${idx}\`}\n                      role="region"\n                      aria-labelledby={\`faq-trigger-\${idx}\`}\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
      ],
    ],
  ],

  // ── BBA FAQ ──
  [
    "apps/website/src/components/landingPageBBA/FAQ.jsx",
    [
      [
        `<button\n                  onClick={() => setOpenIndex(isOpen ? null : idx)}\n                  className="flex w-full items-center justify-between p-5 text-left"\n                >\n                  <h3 className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                    {faq.question}\n                  </h3>\n                  <div className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                  </div>\n                </button>`,
        `<h3 className="m-0">\n                  <button\n                    id={\`faq-trigger-\${idx}\`}\n                    type="button"\n                    aria-expanded={isOpen}\n                    aria-controls={\`faq-panel-\${idx}\`}\n                    onClick={() => setOpenIndex(isOpen ? null : idx)}\n                    className="flex w-full items-center justify-between p-5 text-left"\n                  >\n                    <span className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                      {faq.question}\n                    </span>\n                    <span className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                    </span>\n                  </button>\n                </h3>`,
      ],
      [
        `<motion.div\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
        `<motion.div\n                      id={\`faq-panel-\${idx}\`}\n                      role="region"\n                      aria-labelledby={\`faq-trigger-\${idx}\`}\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
      ],
    ],
  ],

  // ── FSD FAQ ──
  [
    "apps/website/src/components/landingPageFSD/FAQ.jsx",
    [
      [
        `<button\n                      onClick={() => setOpenIndex(isOpen ? null : idx)}\n                      className="flex w-full items-center justify-between p-5 text-left"\n                    >\n                      <h3 className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                        {faq.question}\n                      </h3>\n                      <div className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                      </div>\n                    </button>`,
        `<h3 className="m-0">\n                      <button\n                        id={\`faq-trigger-\${idx}\`}\n                        type="button"\n                        aria-expanded={isOpen}\n                        aria-controls={\`faq-panel-\${idx}\`}\n                        onClick={() => setOpenIndex(isOpen ? null : idx)}\n                        className="flex w-full items-center justify-between p-5 text-left"\n                      >\n                        <span className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                          {faq.question}\n                        </span>\n                        <span className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                        </span>\n                      </button>\n                    </h3>`,
      ],
      [
        `<motion.div\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
        `<motion.div\n                      id={\`faq-panel-\${idx}\`}\n                      role="region"\n                      aria-labelledby={\`faq-trigger-\${idx}\`}\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
      ],
    ],
  ],

  // ── DGM FAQ ──
  [
    "apps/website/src/components/landingPageDGM/FAQ.jsx",
    [
      [
        `<button\n                      onClick={() => setOpenIndex(isOpen ? null : idx)}\n                      className="flex w-full items-center justify-between p-5 text-left"\n                    >\n                      <h3 className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                        {faq.question}\n                      </h3>\n                      <div className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                      </div>\n                    </button>`,
        `<h3 className="m-0">\n                      <button\n                        id={\`faq-trigger-\${idx}\`}\n                        type="button"\n                        aria-expanded={isOpen}\n                        aria-controls={\`faq-panel-\${idx}\`}\n                        onClick={() => setOpenIndex(isOpen ? null : idx)}\n                        className="flex w-full items-center justify-between p-5 text-left"\n                      >\n                        <span className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                          {faq.question}\n                        </span>\n                        <span className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                        </span>\n                      </button>\n                    </h3>`,
      ],
      [
        `<motion.div\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
        `<motion.div\n                      id={\`faq-panel-\${idx}\`}\n                      role="region"\n                      aria-labelledby={\`faq-trigger-\${idx}\`}\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
      ],
    ],
  ],

  // ── ProgramFAQ ──
  [
    "apps/website/src/components/programspage/ProgramsFAQ.jsx",
    [
      [
        `<button\n                  onClick={() => setOpenIndex(isOpen ? null : idx)}\n                  className="flex w-full items-center justify-between p-5 text-left"\n                >\n                  <h3 className={\`text-base font-bold transition-colors \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                    {faq.question}\n                  </h3>\n                  <div\n                    className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}\n                  >\n                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}\n                  </div>\n                </button>`,
        `<h3 className="m-0">\n                  <button\n                    id={\`faq-trigger-\${idx}\`}\n                    type="button"\n                    aria-expanded={isOpen}\n                    aria-controls={\`faq-panel-\${idx}\`}\n                    onClick={() => setOpenIndex(isOpen ? null : idx)}\n                    className="flex w-full items-center justify-between p-5 text-left"\n                  >\n                    <span className={\`text-base font-bold transition-colors \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                      {faq.question}\n                    </span>\n                    <span\n                      className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}\n                    >\n                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}\n                    </span>\n                  </button>\n                </h3>`,
      ],
      [
        `<motion.div\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
        `<motion.div\n                      id={\`faq-panel-\${idx}\`}\n                      role="region"\n                      aria-labelledby={\`faq-trigger-\${idx}\`}\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.25, ease: "easeInOut" }}\n                    >`,
      ],
    ],
  ],

  // ── FAQSection (homepage/about) ──
  [
    "apps/website/src/components/common/FAQSection.jsx",
    [
      [
        `<button\n                  onClick={() => setOpenIndex(isOpen ? null : idx)}\n                  className="w-full flex justify-between items-center p-6 text-left"\n                >\n                  <h3\n                    className={\`text-lg font-bold transition-colors \${isOpen ? "text-primary" : "text-foreground"} m-0\`}\n                  >\n                    {faq.question}\n                  </h3>\n\n                  <div\n                    className={\`shrink-0 ml-4 p-2 rounded-full transition-transform duration-300 \${isOpen ? "bg-primary text-primary-foreground rotate-0" : "bg-muted text-muted-foreground rotate-90"}\`}\n                  >\n                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}\n                  </div>\n                </button>`,
        `<h3 className="m-0">\n                  <button\n                    id={\`faq-trigger-\${idx}\`}\n                    type="button"\n                    aria-expanded={isOpen}\n                    aria-controls={\`faq-panel-\${idx}\`}\n                    onClick={() => setOpenIndex(isOpen ? null : idx)}\n                    className="w-full flex justify-between items-center p-6 text-left"\n                  >\n                    <span\n                      className={\`text-lg font-bold transition-colors \${isOpen ? "text-primary" : "text-foreground"}\`}\n                    >\n                      {faq.question}\n                    </span>\n\n                    <span\n                      className={\`shrink-0 ml-4 p-2 rounded-full transition-transform duration-300 \${isOpen ? "bg-primary text-primary-foreground rotate-0" : "bg-muted text-muted-foreground rotate-90"}\`}\n                    >\n                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}\n                    </span>\n                  </button>\n                </h3>`,
      ],
      [
        `<motion.div\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.3, ease: "easeInOut" }}\n                    >`,
        `<motion.div\n                      id={\`faq-panel-\${idx}\`}\n                      role="region"\n                      aria-labelledby={\`faq-trigger-\${idx}\`}\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      transition={{ duration: 0.3, ease: "easeInOut" }}\n                    >`,
      ],
    ],
  ],

  // ── FAQsAccordion (/faqs page) ──
  [
    "apps/website/src/components/faqspage/FAQsAccordion.jsx",
    [
      [
        `<button\n                                            onClick={() => setOpenIndex(isOpen ? -1 : idx)}\n                                            className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"\n                                        >\n                                            <div className="flex items-start gap-3">\n                                                <span className={\`mt-0.5 shrink-0 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                                                    {idx + 1}\n                                                </span>\n                                                <h3 className={\`text-sm font-semibold leading-snug transition-colors \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                                                    {faq.question}\n                                                </h3>\n                                            </div>\n                                            <div className={\`shrink-0 mt-0.5 rounded-full p-1 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                                                {isOpen ? <Minus size={12} /> : <Plus size={12} />}\n                                            </div>\n                                        </button>`,
        `<h3 className="m-0">\n                                            <button\n                                                id={\`faq-trigger-\${idx}\`}\n                                                type="button"\n                                                aria-expanded={isOpen}\n                                                aria-controls={\`faq-panel-\${idx}\`}\n                                                onClick={() => setOpenIndex(isOpen ? -1 : idx)}\n                                                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"\n                                            >\n                                                <div className="flex items-start gap-3">\n                                                    <span className={\`mt-0.5 shrink-0 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                                                        {idx + 1}\n                                                    </span>\n                                                    <span className={\`text-sm font-semibold leading-snug transition-colors \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                                                        {faq.question}\n                                                    </span>\n                                                </div>\n                                                <span className={\`shrink-0 mt-0.5 rounded-full p-1 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                                                    {isOpen ? <Minus size={12} /> : <Plus size={12} />}\n                                                </span>\n                                            </button>\n                                        </h3>`,
      ],
      [
        `<motion.div\n                                                    initial={{ height: 0, opacity: 0 }}\n                                                    animate={{ height: "auto", opacity: 1 }}\n                                                    exit={{ height: 0, opacity: 0 }}\n                                                    transition={{ duration: 0.22, ease: "easeInOut" }}\n                                                >`,
        `<motion.div\n                                                    id={\`faq-panel-\${idx}\`}\n                                                    role="region"\n                                                    aria-labelledby={\`faq-trigger-\${idx}\`}\n                                                    initial={{ height: 0, opacity: 0 }}\n                                                    animate={{ height: "auto", opacity: 1 }}\n                                                    exit={{ height: 0, opacity: 0 }}\n                                                    transition={{ duration: 0.22, ease: "easeInOut" }}\n                                                >`,
      ],
    ],
  ],

  // ── TestFAQ ──
  [
    "apps/website/src/components/testpage/TestFAQ.jsx",
    [
      [
        `<button\n                        onClick={() => setOpenIndex(isOpen ? null : idx)}\n                        className="flex w-full items-center justify-between p-5 text-left"\n                      >\n                        <h3 className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                          {faq.question}\n                        </h3>\n                        <div className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                        </div>\n                      </button>`,
        `<h3 className="m-0">\n                        <button\n                          id={\`faq-trigger-\${idx}\`}\n                          type="button"\n                          aria-expanded={isOpen}\n                          aria-controls={\`faq-panel-\${idx}\`}\n                          onClick={() => setOpenIndex(isOpen ? null : idx)}\n                          className="flex w-full items-center justify-between p-5 text-left"\n                        >\n                          <span className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                            {faq.question}\n                          </span>\n                          <span className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                            {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                          </span>\n                        </button>\n                      </h3>`,
      ],
      [
        `<motion.div\n                        initial={{ height: 0, opacity: 0 }}\n                        animate={{ height: "auto", opacity: 1 }}\n                        exit={{ height: 0, opacity: 0 }}\n                        transition={{ duration: 0.25, ease: "easeInOut" }}\n                      >`,
        `<motion.div\n                        id={\`faq-panel-\${idx}\`}\n                        role="region"\n                        aria-labelledby={\`faq-trigger-\${idx}\`}\n                        initial={{ height: 0, opacity: 0 }}\n                        animate={{ height: "auto", opacity: 1 }}\n                        exit={{ height: 0, opacity: 0 }}\n                        transition={{ duration: 0.25, ease: "easeInOut" }}\n                      >`,
      ],
    ],
  ],

  // ── SupportFAQ ──
  [
    "apps/website/src/components/supportpage/SupportFAQ.jsx",
    [
      [
        `<button\n                        onClick={() => setOpenIndex(isOpen ? null : idx)}\n                        className="flex w-full items-center justify-between p-5 text-left"\n                      >\n                        <h3 className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"} m-0\`}>\n                          {faq.question}\n                        </h3>\n                        <div className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                        </div>\n                      </button>`,
        `<h3 className="m-0">\n                        <button\n                          id={\`faq-trigger-\${idx}\`}\n                          type="button"\n                          aria-expanded={isOpen}\n                          aria-controls={\`faq-panel-\${idx}\`}\n                          onClick={() => setOpenIndex(isOpen ? null : idx)}\n                          className="flex w-full items-center justify-between p-5 text-left"\n                        >\n                          <span className={\`text-sm font-bold transition-colors sm:text-base \${isOpen ? "text-primary" : "text-foreground"}\`}>\n                            {faq.question}\n                          </span>\n                          <span className={\`ml-4 shrink-0 rounded-full p-1.5 transition-all \${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}\`}>\n                            {isOpen ? <Minus size={14} /> : <Plus size={14} />}\n                          </span>\n                        </button>\n                      </h3>`,
      ],
      [
        `<motion.div\n                        initial={{ height: 0, opacity: 0 }}\n                        animate={{ height: "auto", opacity: 1 }}\n                        exit={{ height: 0, opacity: 0 }}\n                        transition={{ duration: 0.25, ease: "easeInOut" }}\n                      >`,
        `<motion.div\n                        id={\`faq-panel-\${idx}\`}\n                        role="region"\n                        aria-labelledby={\`faq-trigger-\${idx}\`}\n                        initial={{ height: 0, opacity: 0 }}\n                        animate={{ height: "auto", opacity: 1 }}\n                        exit={{ height: 0, opacity: 0 }}\n                        transition={{ duration: 0.25, ease: "easeInOut" }}\n                      >`,
      ],
    ],
  ],
];

let count = 0;
let failCount = 0;

for (const [file, replacements] of fixes) {
  const fullPath = path.join(ROOT, file);
  let content = fs.readFileSync(fullPath, "utf8");
  let dirty = false;

  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.replace(search, replace);
      dirty = true;
      count++;
    } else {
      console.log(
        `  ✗ ${file}: pattern #${replacements.indexOf([search, replace]) + 1} NOT FOUND`,
      );
      failCount++;
    }
  }

  if (dirty) fs.writeFileSync(fullPath, content);
}

console.log(`\n${count} replacements applied, ${failCount} failures.`);
