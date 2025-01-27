import { useState } from "react";
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DownloadIcon from '../../../assets/images/downloadSpotDoc.svg'
const ParentButtonApply = ({ text }) => {
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ParentGuardianForm from './ParentGuardianForm';

const ParentButtonApply = ({ text, onClick }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const downloadWaiverAsPdf = async () => {
    setIsFormVisible(true);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const waiverElement = document.querySelector(".waiver-container");

    html2canvas(waiverElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("Parent_Guardian_Waiver.pdf");
    }).catch((error) => {
      alert("Failed to generate the PDF. Please try again.");
    }).finally(() => {
      setIsFormVisible(false);
    });
  };

  return (
    <div>
      {isFormVisible && (
        <div style={{ position: 'absolute', top: "-10000px", left: "-10000px", zIndex: -1 }}>
          <ParentGuardianForm />
        </div>
      )}

      <button className='parentGuardian-button' 
        onClick={() => {downloadWaiverAsPdf();
          if (onClick) onClick();
        }}>
      {' '}
      <img src={DownloadIcon}></img>
      {/* <FontAwesomeIcon
        icon={faFileUpload}
        className='upload-apply-icon file-input-icon'
      /> */}
      {text}
    </button>
    </div>
  )
}

export { ParentButtonApply }
