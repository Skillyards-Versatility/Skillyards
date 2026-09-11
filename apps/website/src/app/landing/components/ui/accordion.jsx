"use client";

import * as React from "react";

const AccordionContext = React.createContext(null);

export function Accordion({ children, type = "single", collapsible = true, defaultValue }) {
  const [openValue, setOpenValue] = React.useState(defaultValue || "");

  const toggleItem = React.useCallback(
    (value) => {
      setOpenValue((prev) => {
        if (prev === value) {
          return collapsible ? "" : prev;
        }
        return value;
      });
    },
    [collapsible]
  );

  return (
    <AccordionContext.Provider value={{ openValue, toggleItem }}>
      <div className="divide-y divide-border">{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ children, value, className = "" }) {
  return (
    <div className={`border-b border-border ${className}`} data-state={value}>
      <AccordionContext.Provider value={{ ...React.useContext(AccordionContext), itemValue: value }}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
}

export function AccordionTrigger({ children, className = "" }) {
  const { openValue, toggleItem, itemValue } = React.useContext(AccordionContext);
  const isOpen = openValue === itemValue;

  return (
    <button
      type="button"
      onClick={() => toggleItem(itemValue)}
      className={`w-full py-4 font-medium transition-all hover:underline flex justify-between items-center ${className}`}
      aria-expanded={isOpen}
    >
      {children}
      <span
        className={`text-muted-foreground transition-transform duration-200 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      >
        ▾
      </span>
    </button>
  );
}

export function AccordionContent({ children, className = "" }) {
  const { openValue, itemValue } = React.useContext(AccordionContext);
  const isOpen = openValue === itemValue;

  if (!isOpen) return null;

  return (
    <div className={`pb-4 pt-0 transition-all ${className}`}>
      {children}
    </div>
  );
}
