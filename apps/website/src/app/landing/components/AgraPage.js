import React from "react";

export default function AgraPage() {
  return (
    <main className="bg-[#f3f3f3] dark:bg-[#28262c] text-black dark:text-white">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          BBA, BCA & Digital Marketing Institute in Agra
        </h1>

        <p className="text-lg leading-8">
          Skillyards Versatality Limited in Agra offers industry-oriented
          education focused on practical skills, career development,
          internships, live projects and placement support.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {["BBA", "BCA", "Digital Marketing"].map((c) => (
            <div
              key={c}
              className="rounded-xl p-6 bg-white dark:bg-neutral-800 shadow"
            >
              <h2 className="text-2xl font-semibold">{c}</h2>
              <p className="mt-3">
                Industry-oriented curriculum with practical learning.
              </p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Course Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-indigo-700 text-white">
                <tr>
                  <th className="p-4 text-left">Program</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Focus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#d4c2fc] dark:bg-[#3040a8]">
                  <td className="p-4">BBA</td>
                  <td className="p-4">3 Years</td>
                  <td className="p-4">Business & Management</td>
                </tr>
                <tr>
                  <td className="p-4">BCA</td>
                  <td className="p-4">3 Years</td>
                  <td className="p-4">Software & IT</td>
                </tr>
                <tr className="bg-[#d4c2fc] dark:bg-[#3040a8]">
                  <td className="p-4">Digital Marketing</td>
                  <td className="p-4">3-12 Months</td>
                  <td className="p-4">SEO, Ads, Social Media</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Why Choose Skillyards?</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Live Projects</li>
            <li>Experienced Trainers</li>
            <li>Placement Assistance</li>
            <li>Career Guidance</li>
            <li>Industry Workshops</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
