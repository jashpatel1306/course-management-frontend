import axiosInstance from "apiServices/axiosInstance";
import { Button } from "components/ui";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const CertificateView = () => {
  const params = useParams();
  const certificateId = params.certificateId;
  const [studentName] = useState("{{FULL CANDIDATE NAME}}");
  const [courseName] = useState("{{Name of the training course}}");
  const [certificationNumber] = useState(
    "Ref-CCC/SKG/"
  );

  const [initialValues, setInitialValues] = useState({
    studentName: "",
    courseName: "",
    certificationNumber: "",
    companyLogo1: null,
    companyLogo2: null,
    signature1: null,
    signature2: null,
    signatory1Name: "",
    signatory1Title: "",
    signatory2Name: "",
    signatory2Title: ""
  });

  const certificateRef = useRef(null);


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

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/student-certificates/${certificateId}`
        );
        const data = response.data;
        setInitialValues(data);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    };
    fetchTemplateData();
  }, []);

  return (
    <>
      <div className="">
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
                  {certificationNumber}{initialValues?.certificationNumber}
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
                  {initialValues?.studentName}
                </h2>
                <div className="mb-8">
                  <p className="text-lg text-gray-700 mb-2">
                    For successful completion of
                  </p>
                  <h3 className="text-xl md:text-2xl font-semibold text-black">
                    {initialValues?.courseName}
                  </h3>
                </div>
              </div>

              {/* Company Logos */}
              <div className="flex justify-center items-center gap-8 mb-8">
                {initialValues?.companyLogo1 && (
                  <div className="flex flex-col items-center">
                    <img
                      src={initialValues?.companyLogo1}
                      alt="Company Logo 1"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                )}
                {initialValues?.companyLogo2 && (
                  <>
                    <div className="w-0.5 h-16 bg-gray-300"></div>
                    <div className="flex flex-col items-center">
                      <img
                        src={initialValues?.companyLogo2}
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
                    {initialValues?.signature1 && (
                      <img
                        src={initialValues?.signature1}
                        alt="Signature 1"
                        className="w-full h-12 object-contain mb-2"
                      />
                    )}
                  </div>
                  <p className="font-semibold text-black text-sm">
                    {initialValues?.signatory1Name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {initialValues?.signatory1Title}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-48 border-b border-gray-400 mb-2">
                    {initialValues?.signature2 && (
                      <img
                        src={initialValues?.signature2}
                        alt="Signature 2"
                        className="w-full h-12 object-contain mb-2"
                      />
                    )}
                  </div>
                  <p className="font-semibold text-black text-sm">
                    {initialValues?.signatory2Name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {initialValues?.signatory2Title}
                  </p>
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

export default CertificateView;
