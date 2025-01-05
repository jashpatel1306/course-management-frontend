import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Switcher,
  Drawer,
  Select,
  DatePicker
} from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { FormNumericInput, PasswordInput } from "components/shared";
import { MdDelete } from "react-icons/md";
import useEncryption from "common/useEncryption";
const typeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" }
];
function PublicLinkForm(props) {
  const { handleCloseClick, publicLinkData, isOpen } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const publicLinkValidationSchema = Yup.object().shape({
    publicLinkName: Yup.string().required("name is required"),
    quizId: Yup.array()
      .of(Yup.string().trim().required("Quiz cannot be empty"))
      .min(1, "At least one Quiz is required")
      .test("not-empty", "At least one Quiz is required", (arr) =>
        arr ? arr.some((item) => item.trim() !== "") : false
      )
      .required("Instructions are required"),
    password: Yup.string().required("password is required"),
    noofHits: Yup.string().required("licenses is required"),
    startDate: Yup.date().required("start Date is required"),
    endDate: Yup.date()
      .required("End Date is required")
      .min(Yup.ref("startDate")),
    specificField: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string().required("Field label is required"), // Example of a required field in the object
          type: Yup.string().required("Field type is required") // Another required field
        })
      )
      .test("not-empty", "At least specific Field is required", (arr) => {
        return arr && arr.every((item) => item.label && item.type);
      })
      .min(1, "At least one specific field is required")
      .required("Specific field is required"),
    instruction: Yup.array()
      .of(Yup.string().trim().required("Instruction cannot be empty")) // Ensure each item is a non-empty string
      .min(1, "At least one instruction is required") // Ensure the array has at least one item
      .test("not-empty", "At least one instruction is required", (arr) =>
        arr ? arr.some((item) => item.trim() !== "") : false
      ) // Custom test to ensure at least one non-empty item
      .required("Instructions are required"),
    active: Yup.boolean()
  });
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizzeList, setQuizzeList] = useState([]);
  const [formData, setFormData] = useState({
    publicLinkId: "",
    quizId: [],
    publicLinkName: "",
    password: "",
    noofHits: "",
    endDate: null,
    startDate: null,
    specificField: [{ label: "", type: "" }],
    instruction: [""],
    active: true
  });
  const [errorData, setErrorData] = useState({
    quizId: "",
    password: "",
    publicLinkName: "",
    noofHits: "",
    endDate: "",
    startDate: "",
    specificField: "",
    instruction: ""
  });

  const resetErrorData = () => {
    setErrorData({
      quizId: "",
      password: "",
      publicLinkName: "",
      noofHits: "",
      endDate: "",
      startDate: "",
      instruction: "",
      specificField: ""
    });
  };

  const resetFormData = () => {
    setFormData({
      publicLinkId: "",
      quizId: [],
      password: "",
      publicLinkName: "",
      noofHits: "",
      instruction: [""],
      endDate: null,
      startDate: null,
      specificField: [{ label: "", type: "" }],

      active: true
    });
  };

  useEffect(() => {
    if (isOpen) {
      getQuizzeOptionData();
    }
  }, [isOpen]);
  const setUpdateData = async (publicLinkData) => {
    const decryptPassword = await useEncryption.decryptData(
      publicLinkData.password
    );
    setFormData({
      publicLinkId: publicLinkData?._id ? publicLinkData?._id : "",
      quizId: publicLinkData?.quizId ? publicLinkData?.quizId : [],
      password: publicLinkData?.password ? decryptPassword : "",
      noofHits: publicLinkData?.noofHits ? publicLinkData?.noofHits : "",
      publicLinkName: publicLinkData?.publicLinkName
        ? publicLinkData?.publicLinkName
        : "",
      endDate: publicLinkData?.endDate
        ? new Date(publicLinkData?.endDate)
        : null,
      startDate: publicLinkData?.startDate
        ? new Date(publicLinkData?.startDate)
        : null,
      specificField: publicLinkData?.specificField
        ? publicLinkData?.specificField
        : "",
      instruction: publicLinkData?.instruction
        ? publicLinkData?.instruction
        : [""],
      active:
        publicLinkData?.active !== undefined ? publicLinkData?.active : true
    });
  };
  useEffect(() => {
    if (publicLinkData?._id) {
      setUpdateData(publicLinkData);
    }
  }, [publicLinkData]);

  const getQuizzeOptionData = async () => {
    try {
      setQuizLoading(true);
      const response = await axiosInstance.get(
        `user/get-public-quizzes-option`
      );

      if (response.success) {
        setQuizzeList(response.data);
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getQuizzeOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setQuizLoading(false);
    }
  };
  const addNewPublicLinkMethod = async (value) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`admin/public-link`, value);
      if (response.success) {
        setLoading(false);
        resetErrorData();
        resetFormData();
        handleCloseClick();
      } else {
        setLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      openNotification("danger", error.message);
      setLoading(false);
    }
  };
  const editPublicLinkMethod = async (value, publicLinkId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `admin/public-link/${publicLinkId}`,
        value
      );
      if (response.success) {
        setLoading(false);
        resetErrorData();
        resetFormData();
        handleCloseClick();
      } else {
        setLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      openNotification("danger", error.message);
      setLoading(false);
    }
  };
  const getErrorMessages = ({ path, message, inner }) => {
    if (inner && inner?.length) {
      return inner.reduce((acc, { path, message }) => {
        acc[path] = message;
        return acc;
      }, {});
    }
    return { [path]: message };
  };
  const formValidation = () => {
    try {
      publicLinkValidationSchema.validateSync(formData, { abortEarly: false });
      return {
        quizId: "",
        password: "",
        noofHits: "",
        endDate: "",
        startDate: "",
        instruction: "",
        specificField: ""
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          quizId: "",
          password: "",
          noofHits: "",
          endDate: "",
          startDate: "",
          instruction: "",
          publicLinkName: "",
          specificField: ""
        };
      } else {
        console.log("errorObject.instruction: ", errorObject);
        return {
          ...errorData,
          status: true,
          quizId: errorObject.quizId ? errorObject.quizId : "",
          password: errorObject.password ? errorObject.password : "",
          noofHits: errorObject.noofHits ? errorObject.noofHits : "",
          publicLinkName: errorObject.publicLinkName
            ? errorObject.publicLinkName
            : "",

          endDate: errorObject.endDate ? errorObject.endDate : "",
          startDate: errorObject.startDate ? errorObject.startDate : "",
          instruction: errorObject.instruction ? errorObject.instruction : [""],
          specificField: errorObject.specificField
            ? errorObject.specificField
            : ""
        };
      }
    }
  };
  const SubmitHandle = async () => {
    const errorObject = formValidation();
    if (!errorObject.status) {
      resetErrorData();
      if (publicLinkData?._id) {
        const newFormData = {
          ...formData,
          password: await useEncryption.encryptData(formData.password)
        };
        await editPublicLinkMethod(newFormData, publicLinkData?._id);
      } else {
        const newFormData = {
          ...formData,
          password: await useEncryption.encryptData(formData.password)
        };
        await addNewPublicLinkMethod(newFormData);
      }
    } else {
      setErrorData(errorObject);
    }
  };
  const handleSpecificFieldChange = (label, index, value) => {
    const newSpecificField = [...formData.specificField];
    newSpecificField[index][label] = value;
    setFormData({
      ...formData,
      specificField: newSpecificField
    });
  };
  const addSpecificField = () => {
    setFormData({
      ...formData,
      specificField: [...formData.specificField, { label: "", type: "text" }] // Add new empty specificField
    });
  };
  const removeSpecificField = (index) => {
    const newSpecificField = formData.specificField.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      specificField: newSpecificField
    });
  };
  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData?.instruction];
    newInstructions[index] = value;
    setFormData({
      ...formData,
      instruction: newInstructions
    });
  };
  const addInstruction = () => {
    setFormData({
      ...formData,
      instruction: [...formData?.instruction, ""] // Add new empty instruction
    });
  };
  const removeInstruction = (index) => {
    const newInstructions = formData?.instruction?.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      instruction: newInstructions
    });
  };
  return (
    <>
      <Drawer
        title={
          <div
            className={`text-xl font-semibold text-${themeColor}-${primaryColorLevel}`}
          >
            {publicLinkData ? "Update Public Link" : "Generate Public Link"}
          </div>
        }
        isOpen={isOpen}
        width={600}
        onClose={() => {
          resetErrorData();
          resetFormData();
          handleCloseClick();
        }}
        onRequestClose={() => {
          resetErrorData();
          resetFormData();
          handleCloseClick();
        }}
        footer={
          <div className="flex w-full justify-between items-center">
            <div>
              {!publicLinkData?._id && (
                <Button
                  type="reset"
                  onClick={() => {
                    resetErrorData();
                    resetFormData();
                  }}
                  variant="solid"
                  color="red-500"
                >
                  Reset
                </Button>
              )}
            </div>
            <Button
              className="white-spinner"
              variant="solid"
              onClick={SubmitHandle}
              loading={loading}
            >
              {publicLinkData ? "Update" : "Submit"}
            </Button>
          </div>
        }
        headerClass="items-start bg-gray-100 dark:bg-gray-700"
        footerClass="border-t-2 p-3"
      >
        <div className="text-sm">
          {/* Name */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Name
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Name"
                className={
                  errorData.publicLinkName
                    ? "select-error capitalize"
                    : "capitalize"
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    publicLinkName: e.target.value
                  });
                }}
                value={formData?.publicLinkName}
              />
            </div>
            {DisplayError(errorData.publicLinkName)}
          </div>
          {/*  Quizze Name */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Quiz Name
            </div>
            <div className="col-span-2">
              <Select
                isMulti
                placeholder="Select Quiz"
                loading={quizLoading}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    quizId: value.map((info) => info.value)
                  });
                }}
                value={quizzeList.filter((quiz) =>
                  formData?.quizId.includes(quiz.value)
                )}
                // defaultValue={quizzeList.filter((quiz) =>
                //     formData?.quizId.includes(quiz.value)
                //   )}
                options={quizzeList}
                className={errorData.quizId && "select-error"}
              />
            </div>
            {DisplayError(errorData.quizId)}
          </div>
          {/* Password */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Password
            </div>
            <div className="col-span-2">
              <PasswordInput
                type="text"
                placeholder="Please Enter Link Password"
                className={errorData.password && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    password: e.target.value
                  });
                }}
                value={formData?.password}
              />
            </div>
            {DisplayError(errorData.password)}
          </div>
          {/* licenses */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Licenses
            </div>
            <div className="col-span-2">
              <FormNumericInput
                placeholder="Enter Licenses"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    noofHits: e.target.value
                  });
                }}
                value={formData?.noofHits}
                className={errorData.noofHits && "select-error"}
              />
            </div>
            {DisplayError(errorData.noofHits)}
          </div>
          {/* startDate */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Start Date & Time
            </div>
            <div className="col-span-2">
              <DatePicker.DateTimepicker
                placeholder="Please Select a Start Date"
                className={errorData.startDate && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    startDate: e
                  });
                }}
                value={formData?.startDate}
              />
            </div>
            {DisplayError(errorData.startDate)}
          </div>
          {/* endDate */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              End Date & Time
            </div>
            <div className="col-span-2">
              <DatePicker.DateTimepicker
                placeholder="Please Select a End Date"
                className={errorData.endDate && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    endDate: e
                  });
                }}
                minDate={formData?.startDate}
                value={formData?.endDate}
              />
            </div>
            {DisplayError(errorData.endDate)}
          </div>
          {/* Quiz Instructions */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Instructions
            </div>
            <div className="col-span-2">
              {formData?.instruction?.map((instruction, index) => (
                <div className="flex gap-4 col-span-2 mt-2" key={index}>
                  <Input
                    type="text"
                    placeholder={`Enter Quiz Instruction ${index + 1}`}
                    value={instruction}
                    onChange={(e) =>
                      handleInstructionChange(index, e.target.value)
                    }
                  />
                  {formData?.instruction?.length > 1 && (
                    <Button
                      shape="circle"
                      icon={<MdDelete />}
                      onClick={() => removeInstruction(index)}
                    />
                  )}
                </div>
              ))}
              {DisplayError(errorData.instruction)}
              <Button
                type="button"
                size="sm"
                onClick={addInstruction}
                className="mt-2"
              >
                Add New Instruction
              </Button>
            </div>
          </div>
          {/* specific Field */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Specific Field
            </div>
            <div className="col-span-2">
              {formData?.specificField?.map((specificField, index) => (
                <div className="flex gap-4 col-span-2 mt-2" key={index}>
                  <Input
                    type="text"
                    placeholder={`Enter Field Label`}
                    value={specificField.label}
                    onChange={(e) =>
                      handleSpecificFieldChange("label", index, e.target.value)
                    }
                  />

                  <Select
                    placeholder="Select Field Type"
                    options={typeOptions}
                    value={typeOptions.filter(
                      (item) => item.value === specificField.type
                    )}
                    onChange={(e) => {
                      handleSpecificFieldChange("type", index, e.value);
                    }}
                    className="w-72 text-sm"
                  ></Select>
                  {formData.specificField.length > 1 && (
                    <Button
                      shape="circle"
                      icon={<MdDelete />}
                      onClick={() => removeSpecificField(index)}
                    />
                  )}
                </div>
              ))}
              <Button onClick={addSpecificField} size="sm" className="mt-2">
                Add New Specific Field
              </Button>
            </div>
            {DisplayError(errorData.specificField)}
          </div>
          {/* Active */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Active
            </div>
            <div className="col-span-2">
              <Switcher
                checked={formData?.active}
                onChange={(val) => {
                  setFormData({
                    ...formData,
                    active: !val
                  });
                }}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default PublicLinkForm;
