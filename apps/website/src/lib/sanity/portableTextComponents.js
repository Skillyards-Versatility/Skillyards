import Image from "next/image";
import { urlFor } from "./image";
import { getHeadingId } from "./slugifyHeading";

export const portableTextComponents = {

  block: {

    h2: ({ children, value }) => {
      const id = getHeadingId(value);

      return (
        <h2 id={id} className="scroll-mt-28">
          {children}
        </h2>
      );
    },

    h3: ({ children, value }) => {
      const id = getHeadingId(value);

      return (
        <h3 id={id} className="scroll-mt-28">
          {children}
        </h3>
      );
    },

  },

  types: {

    /**
     * Image Renderer
     */
    image: ({ value }) => {
      if (!value?.asset?._ref && !value?.asset) return null;
      const imageUrl = urlFor(value).width(1200).url();

      return (
        <figure className="my-10">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={value.alt || "Blog image"}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </div>

          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    /**
     * Code Block Renderer
     */
    code: ({ value }) => {
      return (
        <div className="my-10 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">

          {value.language && (
            <div className="px-4 py-2 text-xs font-medium bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400">
              {value.language}
            </div>
          )}

          <pre className="overflow-x-auto p-4 text-sm leading-relaxed bg-gray-50 dark:bg-[#0f0f0f]">
            <code className="font-mono">
              {value.code}
            </code>
          </pre>

        </div>
      );
    }

  }
};
