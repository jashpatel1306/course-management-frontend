import React from 'react'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
const CourseView = () => {
  return (
    <div>
      <div className="mt-4">
        <div className=" p-2  rounded-2xl w-2/3 bg-white">
          {/* Section 1 */}
          <Disclosure>
            {({ open }) => (
              <>
                <DisclosureButton className="flex justify-start items-center gap-4 w-full p-2 text-lg font-medium  ">
                  <IoIosArrowDown
                    className={`${open ? "transform rotate-180" : ""}`}
                    size={25}
                  />
                  <span>Section 1: First Step and Introduction</span>
                </DisclosureButton>

                <DisclosurePanel className="py-4 px-12 flex flex-col gap-y-4 w-full">
                  <div className="bg-gray-200 w-full rounded-lg">
                    <Disclosure as="div" className="mb-2">
                      {({ open }) => (
                        <>
                          <DisclosureButton className="flex justify-start items-center gap-4 w-full p-2 text-lg font-medium">
                            <IoIosArrowDown
                              className={`${
                                open ? "transform rotate-180" : ""
                              }`}
                              size={25}
                            />
                            <span>Lecture 1</span>
                          </DisclosureButton>
                          <DisclosurePanel className="pl-12 py-4 w-full	 mt-1 rounded-b-lg bg-gray-100">
                            <div className="flex flex-col px-2 gap-y-2">
                              <p>Some Tips to get you started</p>
                              <p>what is HTML?</p>
                              <p>Course Exercise and video quality</p>
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  </div>

                  <div className="bg-gray-200 w-full rounded-lg ">
                    <Disclosure as="div" className="mb-2">
                      {({ open }) => (
                        <>
                          <DisclosureButton className="flex justify-start items-center gap-4 w-full p-2 text-lg font-medium">
                            <IoIosArrowDown
                              className={`${
                                open ? "transform rotate-180" : ""
                              }`}
                              size={25}
                            />
                            <span>Lecture 2</span>
                          </DisclosureButton>
                          <DisclosurePanel className="pl-12 py-4 w-full	 mt-1 rounded-b-lg bg-gray-100">
                            <div className="flex flex-col px-2 gap-y-2">
                              <p>Lorem Ipsum 1</p>
                              <p>Lorem Ipsum 2</p>
                              <p>Lorem Ipsum 3</p>
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  )
}

export default CourseView
