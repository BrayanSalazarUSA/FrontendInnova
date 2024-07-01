import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const createHTMLString = (data) => {
    const backgroundColor = "rgb(217, 217, 217)"; // valor del fondo principal gris 
    return `
       <br>
    <br>
    <div style="
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    font-family: Calibri, sans-serif;
    color: #333;
    max-width: 800px;
    margin: auto;
    padding: 0; 
    background-color: ${backgroundColor};
    border: 3px solid black;
    margin-top: 25px;
    box-sizing: border-box;">
    
        <div style="grid-column: span 4; padding-left: 12px;">
                <h1 style="font-size: 30px; color: rgb(156, 130, 20); border-bottom: 2px solid rgb(156, 130, 20); padding-bottom: 3px;  font-weight: bold;">
                INCIDENT REPORT
            </h1>
            <p style="color: rgb(0, 0, 0); font-weight: bold;">${data.property.name || ' '}  </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;">${data.property.direction || ' '}</p>
            <p style="color: rgb(0, 0, 0);  font-weight: bold;"> CREATED BY: 
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.createdBy.name || ' '}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> REPORT NUMBER: 
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.numerCase || ' '}</span> 
            </p>
        </div>

        <div style="grid-column: span 4   ; padding-left: 12px;">
            <br>
            <br>
            <p style="color: rgb(0, 0, 0); margin-top: 50px; font-weight: bold;"> DATE OF REPORT: 
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.dateOfReport || ' '}</span> 
            </p> 
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> REPORT TIME: 
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.timeOfReport || ' '}</span> </p>   
        </div>
            <div style="grid-column: span 4; padding-left: 12px;">
            <img src="/Logo4.png" alt="Logo" style="width: 80%; height: auto;">            
        </div>
        <div style="grid-column: 1 / -1; background-color: rgb(0, 0, 0); margin-top: 10px">
            <p style="color: rgb(156, 130, 20); text-align: center; font-size: 20px; font-weight: bold; padding-top: 2px; padding-bottom: 10px">
                INCIDENT INFORMATION
            </p>
        </div>
        <div style="grid-column: span 6; padding-left: 12px; background-color: rgb(166, 166, 166); padding-bottom: 10px;">
            <p style="color: rgb(0, 0, 0);; font-weight: bold;"> INCIDENT TYPE:
            <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.caseType.incident || ' '}</span>
            </p>
            <p style="color: rgb(0, 0, 0);; font-weight: bold;">START TIME OF INCIDENT:
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.incidentStartTime || ' '}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> INCIDENT URGENCY:
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.level || ' '}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> LIST OF MALFUNCTIONING CAMERAS:
               <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.listMalfunctioningCameras || ' '}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold; margin-top: 20px;"> POLICE/FIRST RESPONDER NOTIFIED:
               <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.policeFirstResponderNotified ? 'Yes' : 'No'}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> SECURITY GUARDS NOTIFIED:
               <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.securityGuardsNotified ? 'Yes' : 'No'}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> POLICE CASE NUMBER:
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.policeNumerCase || '  '}</span>
            </p>
        </div>
        <div style="grid-column: span 6; padding-left: 12px; background-color: rgb(166, 166, 166); padding-bottom: 10px;">
               <p style="color: rgb(0, 0, 0); font-weight: bold;"> DATE OF INCIDENT:
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.incidentDate || ' '}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> END TIME OF INCIDENT:
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.incidentEndTime || 'Continue'}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> CAMERAS FUNCTIONING:
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.camerasFunctioning ? 'Yes' : 'No'}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> OBSERVED VIA CAMERAS:
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.observedViaCameras ? 'Yes' : 'No'}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold; margin-top: 20px;"> POLICE/FIRST RESPONDER ON SCENE:
               <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.policeFirstResponderScene || ' '}</span>
            </p>
            <p style="color: rgb(0, 0, 0); font-weight: bold;"> SECURITY GUARDS ON SCENE:
                <span style="color: rgb(0, 0, 0); font-weight: bold;">${data.securityGuardsScene ? 'Yes' : 'No'}</span>
            </p>
        </div>

        <div style="grid-column: 1 / -1; background-color: rgb(0, 0, 0); padding-top: 5px; padding-bottom: 10px">
            <p style="color: rgb(156, 130, 20); text-align: center; font-size: 20px; font-weight: bold; padding-bottom: 6px;">REPORT DETAILS</p>
        </div>
       <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 80px auto; gap: 0;">
            <div style="background-color: rgb(0, 0, 0); margin-top: -1px;"> 
            <img src="/libro.png" alt="Logo" style="width: 100%; height: auto; padding-top:90%">
            </div>
            <div style="background-color: rgb(217, 217, 217); padding: 10px; margin-top: -1px; padding-bottom: 15px;"> 
                <p style="color: rgb(0, 0, 0);">${data.reportDetails || '   '}</p>
            </div>
        </div>
            <div style="grid-column: span 7; padding: 12px;background-color: rgb(0, 0, 0); margin-right: -4px">
            <p style="color: rgb(156, 130, 20); font-weight: bold;"> CREATED BY:
                <span style="color: white;">${data.createdBy.name || ' '}</span>
            </p>
            <p style="color: rgb(156, 130, 20); font-weight: bold;"> FORM OF NOTIFICATION TO CLIENT:
                <span style="color: white;">${data.formNotificationClient || ' '}</span>
            </p>
            <p style="color: rgb(156, 130, 20);; font-weight: bold;"> EMAILED REPORT TO:
                <span style="color: white;">${data.emailedReport || ' '}</span>
            </p>
          </div>
          <div style="grid-column: span 5; background-color: rgb(0, 0, 0);">
          </div>
    </div>
    `;
};
export const exportPdfEvidences = async (data) => {
    const htmlString = createHTMLString(data);
    const htmlContent = document.createElement('div');
    htmlContent.style.width = "1000px";
    htmlContent.innerHTML = htmlString;
    document.body.appendChild(htmlContent);


    const canvas = await html2canvas(htmlContent, {
        scale: 2,
        width: htmlContent.offsetWidth,
        windowWidth: htmlContent.offsetWidth
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
    });


    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const scaleX = pdfWidth / imgWidth;
    const scaleY = pdfHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY);

    pdf.addImage(imgData, 'PNG', scaleX, scaleY, imgWidth * scale, imgHeight * scale);
    document.body.removeChild(htmlContent);
    return pdf.output('blob');

};


