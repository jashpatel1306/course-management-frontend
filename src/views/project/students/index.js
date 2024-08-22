import { Pagination } from "components/ui";
import React, { useState } from "react";

const Students = () => {
  const [page, setPage] = useState(60);

  const onPaginationChange = (val) => {
    setPage(val);
  };
  return (
    <>
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold text-gray-800">Batches</h2>
          <button class="text-indigo-600 font-medium">+ Add Batch</button>
        </div>

        <div class="flex gap-4 overflow-x-auto pb-4">
          <div class="bg-blue-600 text-white p-6 rounded-lg w-56 flex-shrink-0">
            <p class="text-lg font-semibold mb-2">Batch 1</p>
            <p class="text-sm mb-1">Batch Name: LPU-CSE-BT1</p>
            <p class="text-sm mb-1">Total Students: 120</p>
            <p class="text-sm mb-1">Courses Attached: python</p>
            <p class="text-sm mb-1">Trainer Name: Ravi</p>
            <button class="mt-4 text-white font-medium">View →</button>
          </div>

          <div class="bg-blue-600 text-white p-6 rounded-lg w-56 flex-shrink-0">
            <p class="text-lg font-semibold mb-2">Batch 2</p>
            <p class="text-sm mb-1">Batch Name: LPU-CSE-BT1</p>
            <p class="text-sm mb-1">Total Students: 120</p>
            <p class="text-sm mb-1">Courses Attached: python</p>
            <p class="text-sm mb-1">Trainer Name: Ravi</p>
            <button class="mt-4 text-white font-medium">View →</button>
          </div>
          <div class="bg-blue-600 text-white p-6 rounded-lg w-56 flex-shrink-0">
            <p class="text-lg font-semibold mb-2">Batch 1</p>
            <p class="text-sm mb-1">Batch Name: LPU-CSE-BT1</p>
            <p class="text-sm mb-1">Total Students: 120</p>
            <p class="text-sm mb-1">Courses Attached: python</p>
            <p class="text-sm mb-1">Trainer Name: Ravi</p>
            <button class="mt-4 text-white font-medium">View →</button>
          </div>

          <div class="bg-blue-600 text-white p-6 rounded-lg w-56 flex-shrink-0">
            <p class="text-lg font-semibold mb-2">Batch 2</p>
            <p class="text-sm mb-1">Batch Name: LPU-CSE-BT1</p>
            <p class="text-sm mb-1">Total Students: 120</p>
            <p class="text-sm mb-1">Courses Attached: python</p>
            <p class="text-sm mb-1">Trainer Name: Ravi</p>
            <button class="mt-4 text-white font-medium">View →</button>
          </div>

          <div class="bg-blue-600 text-white p-6 rounded-lg w-56 flex-shrink-0">
            <p class="text-lg font-semibold mb-2">Batch 2</p>
            <p class="text-sm mb-1">Batch Name: LPU-CSE-BT1</p>
            <p class="text-sm mb-1">Total Students: 120</p>
            <p class="text-sm mb-1">Courses Attached: python</p>
            <p class="text-sm mb-1">Trainer Name: Ravi</p>
            <button class="mt-4 text-white font-medium">View →</button>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Batch Details</h3>

        <div class="mb-4">
          <button class="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-2">
            Batch 1
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full table-auto">
            <thead>
              <tr class="bg-gray-100 text-left text-sm font-medium text-gray-600">
                <th class="p-4">College Code</th>
                <th class="p-4">College Name</th>
                <th class="p-4">Roll No.</th>
                <th class="p-4">Name</th>
                <th class="p-4">Email</th>
                <th class="p-4">Dept</th>
                <th class="p-4">Section</th>
                <th class="p-4">Gender</th>
                <th class="p-4">Sem</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-4">1042</td>
                <td class="p-4">Techno..</td>
                <td class="p-4">7</td>
                <td class="p-4">Ravi</td>
                <td class="p-4">ravi@gmail.com</td>
                <td class="p-4">ECE</td>
                <td class="p-4">A</td>
                <td class="p-4">M</td>
                <td class="p-4">VI</td>
              </tr>
              <tr class="border-b">
                <td class="p-4">1042</td>
                <td class="p-4">Techno..</td>
                <td class="p-4">7</td>
                <td class="p-4">Ravi</td>
                <td class="p-4">ravi@gmail.com</td>
                <td class="p-4">ECE</td>
                <td class="p-4">A</td>
                <td class="p-4">M</td>
                <td class="p-4">VI</td>
              </tr>
              <tr class="border-b">
                <td class="p-4">1042</td>
                <td class="p-4">Techno..</td>
                <td class="p-4">7</td>
                <td class="p-4">Ravi</td>
                <td class="p-4">ravi@gmail.com</td>
                <td class="p-4">ECE</td>
                <td class="p-4">A</td>
                <td class="p-4">M</td>
                <td class="p-4">VI</td>
              </tr>
              <tr class="border-b">
                <td class="p-4">1042</td>
                <td class="p-4">Techno..</td>
                <td class="p-4">7</td>
                <td class="p-4">Ravi</td>
                <td class="p-4">ravi@gmail.com</td>
                <td class="p-4">ECE</td>
                <td class="p-4">A</td>
                <td class="p-4">M</td>
                <td class="p-4">VI</td>
              </tr>
              <tr class="border-b">
                <td class="p-4">1042</td>
                <td class="p-4">Techno..</td>
                <td class="p-4">7</td>
                <td class="p-4">Ravi</td>
                <td class="p-4">ravi@gmail.com</td>
                <td class="p-4">ECE</td>
                <td class="p-4">A</td>
                <td class="p-4">M</td>
                <td class="p-4">VI</td>
              </tr>
              <tr class="border-b">
                <td class="p-4">1042</td>
                <td class="p-4">Techno..</td>
                <td class="p-4">7</td>
                <td class="p-4">Ravi</td>
                <td class="p-4">ravi@gmail.com</td>
                <td class="p-4">ECE</td>
                <td class="p-4">A</td>
                <td class="p-4">M</td>
                <td class="p-4">VI</td>
              </tr>
              <tr class="border-b">
                <td class="p-4">1042</td>
                <td class="p-4">Techno..</td>
                <td class="p-4">7</td>
                <td class="p-4">Ravi</td>
                <td class="p-4">ravi@gmail.com</td>
                <td class="p-4">ECE</td>
                <td class="p-4">A</td>
                <td class="p-4">M</td>
                <td class="p-4">VI</td>
              </tr>
              <tr class="border-b">
                <td class="p-4">1042</td>
                <td class="p-4">Techno..</td>
                <td class="p-4">7</td>
                <td class="p-4">Ravi</td>
                <td class="p-4">ravi@gmail.com</td>
                <td class="p-4">ECE</td>
                <td class="p-4">A</td>
                <td class="p-4">M</td>
                <td class="p-4">VI</td>
              </tr>
              <tr class="border-b">
                <td class="p-4">1764</td>
                <td class="p-4">KLU</td>
                <td class="p-4">34</td>
                <td class="p-4">Ajay</td>
                <td class="p-4">ravi@gmail.com</td>
                <td class="p-4">CSE</td>
                <td class="p-4">B</td>
                <td class="p-4">M</td>
                <td class="p-4">II</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between items-center mt-6">
          <div>
            <Pagination
              total={100}
              currentPage={page}
              onChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Students;
