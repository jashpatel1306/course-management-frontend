import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as Yup from "yup";
import { Button, Card, Input } from "components/ui";
import { useSelector } from "react-redux";
import { FaSave } from "react-icons/fa";
import axiosInstance from "apiServices/axiosInstance";
import { IoMdClose } from "react-icons/io";

const Index = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [studentName, setStudentName] = useState("{{FULL CANDIDATE NAME}}");
  const [courseName, setCourseName] = useState("{{Name of the training course}}");
  const [certificationNumber, setCertificationNumber] = useState(
    "Ref-CCC/SKG/{{CERTIFICATION-NUMBER}}"
  );

  const [initialValues] = useState({
    companyLogo1: null,
    companyLogo2: null,
    signature1: null,
    signature2: null,
    signatory1Name: "",
    signatory1Title: "",
    signatory2Name: "",
    signatory2Title: ""
  });
  const [companyLogo1, setCompanyLogo1] = useState(
    initialValues.companyLogo1 || null
  );
  const [companyLogo2, setCompanyLogo2] = useState(
    initialValues.companyLogo2 || null
  );
  const [signature1, setSignature1] = useState(
    initialValues.signature1 || null
  );
  const [signature2, setSignature2] = useState(
    initialValues.signature2 || null
  );
  const [signatory1Name, setSignatory1Name] = useState(
    initialValues.signatory1Name || "Nagaveer V"
  );
  const [signatory1Title, setSignatory1Title] = useState(
    initialValues.signatory1Title || "CEO | CCC Group"
  );
  const [signatory2Name, setSignatory2Name] = useState(
    initialValues.signatory2Name || "Skill Graph"
  );
  const [signatory2Title, setSignatory2Title] = useState(
    initialValues.signatory2Title || "Authorized Signatory"
  );

  const certificateRef = useRef(null);

  const handleImageUpload = (file, setter) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setter(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 4,
        useCORS: true,
        logging: false,
        imageTimeout: 0,
        backgroundColor: null,
        windowWidth: certificateRef.current.scrollWidth,
        windowHeight: certificateRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
        hotfixes: ["px_scaling"]
      });

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        canvas.width,
        canvas.height,
        undefined,
        "FAST"
      );
      pdf.save(`${studentName}-Certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const downloadPNG = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 4,
        useCORS: true,
        logging: false,
        imageTimeout: 0,
        backgroundColor: null,
        windowWidth: certificateRef.current.scrollWidth,
        windowHeight: certificateRef.current.scrollHeight
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `${studentName}-Certificate.png`;
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
    }
  };
  const validationSchema = Yup.object().shape({
    companyLogo1: Yup.mixed().required("Company Logo 1 is required"),
    companyLogo2: Yup.mixed(),
    signature1: Yup.mixed().required("Signature 1 is required"),
    signature2: Yup.mixed().required("Signature 2 is required"),
    signatory1Name: Yup.string().required("Signatory 1 Name is required"),
    signatory1Title: Yup.string().required("Signatory 1 Title is required"),
    signatory2Name: Yup.string().required("Signatory 2 Name is required"),
    signatory2Title: Yup.string().required("Signatory 2 Title is required")
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await axiosInstance.get("/api/template-certificates");
        const data = response.data;
        setCompanyLogo1(data[0].companyLogo1);
        setCompanyLogo2(data[0].companyLogo2);
        setSignature1(data[0].signature1);
        setSignature2(data[0].signature2);
        setSignatory1Name(data[0].signatory1Name);
        setSignatory1Title(data[0].signatory1Title);
        setSignatory2Name(data[0].signatory2Name);
        setSignatory2Title(data[0].signatory2Title);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    };
    fetchTemplateData();
  }, []);

  const handleSubmit = async () => {
    try {
      const apiData = {
        companyLogo1: companyLogo1,
        companyLogo2: companyLogo2,
        signature1: signature1,
        signature2: signature2,
        signatory1Name: signatory1Name,
        signatory1Title: signatory1Title,
        signatory2Name: signatory2Name,
        signatory2Title: signatory2Title
      };
      await validationSchema.validate(apiData, { abortEarly: false });
      await axiosInstance.post("/api/template-certificates", apiData);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach(({ path, message }) => {
          errors[path] = message;
        });
      } else {
        console.error("Error validating form:", error);
      }
    }
  };

  return (
    <>
      <div className="">
        {/* Input Controls */}
        <Card className=" mb-4 space-y-6">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Certificate Template Layout
          </div>
        </Card>
        <Card className=" mb-4 space-y-6">
          {/* Candidate Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                {" "}
                Candidate Name *
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="border-cert-accent/20 focus:border-cert-accent"
                />
              </div>
            </div>

            {/* Course Details */}
            <div>
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                {" "}
                Course Name *
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="border-cert-accent/20 focus:border-cert-accent"
                />
              </div>
            </div>

            {/* Certification No */}
            <div>
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                {" "}
                Certification No *
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={certificationNumber}
                  onChange={(e) => setCertificationNumber(e.target.value)}
                  className="border-cert-accent/20 focus:border-cert-accent"
                />
              </div>
            </div>
          </div>

          {/* Company Logos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                {" "}
                Company Logo *
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleImageUpload(e.target.files[0], setCompanyLogo1)
                  }
                  className="border-cert-accent/20 focus:border-cert-accent"
                />
              </div>

              {companyLogo1 && (
                <div className="relative w-20 h-20 mt-2">
                  <img
                    src={companyLogo1}
                    alt="Logo 1"
                    className="w-full h-full object-contain border rounded"
                  />
                  <Button
                    shape="circle"
                    size="xs"
                    variant="twoTone"
                    className="absolute top-0 right-0"
                    color="red-600"
                    onClick={() => setCompanyLogo1(null)} // Replace with your actual state clearing function
                    icon={<IoMdClose />}
                  />
                </div>
              )}
            </div>
            <div>
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                {" "}
                Company Logo
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleImageUpload(e.target.files[0], setCompanyLogo2)
                  }
                  className="border-cert-accent/20 focus:border-cert-accent"
                />
              </div>
              {companyLogo2 && (
                <div className="relative w-20 h-20 mt-2">
                  <img
                    src={companyLogo2}
                    alt="Logo 2"
                    className="w-full h-full object-contain border rounded"
                  />

                  <Button
                    shape="circle"
                    size="xs"
                    variant="twoTone"
                    className="absolute top-0 right-0"
                    color="red-600"
                    onClick={() => setCompanyLogo2(null)} // Replace with your actual state clearing function
                    icon={<IoMdClose />}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Signatory Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div
                className={`font-bold text-lg text-${themeColor}-${primaryColorLevel}`}
              >
                Signatory - 1
              </div>

              <div
                className={`border-2 border-dashed rounded-lg border-${themeColor}-${primaryColorLevel} p-3`}
              >
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Name *
                </div>

                <Input
                  value={signatory1Name}
                  onChange={(e) => setSignatory1Name(e.target.value)}
                  placeholder="Signatory 1 Name"
                  className="border-cert-accent/20 focus:border-cert-accent"
                />
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Title *
                </div>

                <Input
                  value={signatory1Title}
                  onChange={(e) => setSignatory1Title(e.target.value)}
                  placeholder="Signatory 1 Title"
                  className="border-cert-accent/20 focus:border-cert-accent"
                />
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Signature *
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleImageUpload(e.target.files[0], setSignature1)
                    }
                    className="border-cert-accent/20 focus:border-cert-accent"
                  />
                </div>
                {signature1 && (
                  <img
                    src={signature1}
                    alt="Signature 1"
                    className="w-24 h-12 object-contain border rounded  mt-2"
                  />
                )}
              </div>
            </div>
            <div>
              <div
                className={`font-bold text-lg text-${themeColor}-${primaryColorLevel}`}
              >
                Signatory - 2
              </div>

              <div
                className={`border-2 border-dashed rounded-lg border-${themeColor}-${primaryColorLevel} p-3`}
              >
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Name *
                </div>
                <Input
                  value={signatory2Name}
                  onChange={(e) => setSignatory2Name(e.target.value)}
                  placeholder="Signatory 2 Name"
                  className="border-cert-accent/20 focus:border-cert-accent"
                />
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Title *
                </div>
                <Input
                  value={signatory2Title}
                  onChange={(e) => setSignatory2Title(e.target.value)}
                  placeholder="Signatory 2 Title"
                  className="border-cert-accent/20 focus:border-cert-accent"
                />
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Signature *
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleImageUpload(e.target.files[0], setSignature2)
                    }
                    className="border-cert-accent/20 focus:border-cert-accent"
                  />
                </div>
                {signature2 && (
                  <img
                    src={signature2}
                    alt="Signature 2"
                    className="w-24 h-12 object-contain border rounded  mt-2"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center mt-4">
            <Button variant="solid" icon={<FaSave />} onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </Card>

        {/* Certificate Preview */}

        <div className="flex flex-col w-full items-center justify-center">
          <motion.div
            ref={certificateRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl bg-blue-50 rounded-lg shadow-lg p-4 md:p-12  border-8 border-blue-500 relative"
            style={{ aspectRatio: "1.4/1" }}
          >
            {/* Blue decorative corners */}
            <div className="absolute top-0 left-0 w-0 h-0 border-l-[60px] border-l-blue-500 border-b-[60px] border-b-transparent" />
            <div className="absolute top-0 right-0 w-0 h-0 border-r-[60px] border-r-blue-500 border-b-[60px] border-b-transparent" />
            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[60px] border-l-blue-500 border-t-[60px] border-t-transparent" />
            <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[60px] border-r-blue-500 border-t-[60px] border-t-transparent" />

            <div className="relative z-10 h-full flex flex-col ">
              {/* Header with certification number */}
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-gray-700">
                  {certificationNumber}
                </p>
              </div>

              {/* Certificate Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                  Certificate of completion
                </h1>
                <div className="w-32 h-0.5 bg-black mx-auto mt-2"></div>
              </div>

              {/* Certificate Body */}
              <div className="flex-1 flex flex-col justify-center text-center">
                <p className="text-lg text-gray-700 mb-4">
                  This certificate is proudly presented to
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 uppercase tracking-wide">
                  {studentName}
                </h2>
                <div className="mb-8">
                  <p className="text-lg text-gray-700 mb-2">
                    For successful completion of
                  </p>
                  <h3 className="text-xl md:text-2xl font-semibold text-black">
                    {courseName}
                  </h3>
                </div>
              </div>

              {/* Company Logos */}
              <div className="flex justify-center items-center gap-8 mb-8">
                {companyLogo1 && (
                  <div className="flex flex-col items-center">
                    <img
                      src={companyLogo1}
                      alt="Company Logo 1"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                )}
                {companyLogo2 && (
                  <>
                    <div className="w-0.5 h-16 bg-gray-300"></div>
                    <div className="flex flex-col items-center">
                      <img
                        src={companyLogo2}
                        alt="Company Logo 2"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="w-48 border-b border-gray-400 mb-2">
                    {signature1 && (
                      <img
                        src={signature1}
                        alt="Signature 1"
                        className="w-full h-12 object-contain mb-2"
                      />
                    )}
                  </div>
                  <p className="font-semibold text-black text-sm">
                    {signatory1Name}
                  </p>
                  <p className="text-xs text-gray-600">{signatory1Title}</p>
                </div>
                <div className="text-center">
                  <div className="w-48 border-b border-gray-400 mb-2">
                    {signature2 && (
                      <img
                        src={signature2}
                        alt="Signature 2"
                        className="w-full h-12 object-contain mb-2"
                      />
                    )}
                  </div>
                  <p className="font-semibold text-black text-sm">
                    {signatory2Name}
                  </p>
                  <p className="text-xs text-gray-600">{signatory2Title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center items-start mt-4 flex-col md:flex-row gap-4">
          <Button variant="solid" icon={<Download />} onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button variant="solid" icon={<Download />} onClick={downloadPNG}>
            Download PNG
          </Button>
        </div>
      </div>
    </>
  );
};

export default Index;
