import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import ReactImageGallery from "react-image-gallery";
import { useNavigate, useParams } from "react-router-dom";
import { GiPoliceBadge } from "react-icons/gi";
import { MdLocalPolice } from "react-icons/md";
import { GiCctvCamera } from "react-icons/gi";
import { MdMarkEmailRead } from "react-icons/md";

import JSZip from "jszip";
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Dialog } from "primereact/dialog";

import {
  AiFillCheckCircle,
  AiFillFilePdf,
  AiOutlineNumber,
  AiOutlineTeam,
} from "react-icons/ai";

import { Button } from "primereact/button";
import { BsBuildings, BsCalendarDate } from "react-icons/bs";
import { GoUnverified } from "react-icons/go";
import { FaLevelUpAlt, FaUser } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdEmail, MdOutlineMail } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { editReport } from "../helper/Reports/UpdateReport/editReport"
import { getReportId } from "../helper/getReportId"
import { deleteItem } from "../helper/delete";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import postViewedUser from "../helper/postViewedUser "
import { GridPdf } from "../tablesTemplates/Reports/GridPdf";
import ViewedsTable from "../components/Reports/ReportDetails/ViewedsTable";
import TableSkeleton from '../components/TableSkeleton';
import { exportPdfEvidences } from "../helper/ReportDetails/exportPdfEvidences";
import SendEmail from "../components/Forms/reportDetails/SendEmail";
import "../pages/css/ReportDetails/ReportDetails.css"

let url = `${process.env.REACT_APP_SERVER_IP}/reports`;
let noImages = [
  {
    original:
      "https://cdn4.iconfinder.com/data/icons/picture-sharing-sites/32/No_Image-512.png",
    thumbnail:
      "https://cdn4.iconfinder.com/data/icons/picture-sharing-sites/32/No_Image-512.png",
  },
];

let images = [];
let videos = [];

export const ReportDatails = () => {
  const [filesToDownload, setFilesToDownload] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingevidences, setLoadingevidences] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [t, i18n] = useTranslation("global");
  let dataImages = [];
  let dataVideos = [];
  const navigate = useNavigate();
  let { id } = useParams();
  const [flag, setFlag] = useState(false);
  
  const [sendEmailDialogVisible, setSendEmailDialogVisible] = useState(false);

  const [folderName, setFolderName] = useState("");
    const [reportDetails, setReportDetails] = useState({});
  //const {report, isLoading} = useFetchReportId(id, navigate);
  const loadInitialUser = () => {
    const userStored = localStorage.getItem('user');
    if (userStored) {
      return JSON.parse(userStored);
    }
    // Retorna un objeto inicial si no hay nada en localStorage
    return { id: null, viewed: false, role: { rolName: '' } };
  };
  const [user, setUser] = useState(loadInitialUser);

  let userRole = user.role?.rolName || "Monitor";
  

  const {
    reportSaved,
    setreportSaved,
    reportFormVisible,
    setReportFormVisible,
  } = useContext(UserContext);
  
  useEffect(() => {
    getReportId(id, navigate).then((data) => {
      setReportDetails(data);
      setLoading(false);
      let evidences = data?.evidences?.map((evidence) => ({
        name: evidence.name,
      url: `${process.env.REACT_APP_S3_BUCKET_URL}/${evidence.path}`,
      }));
      setFilesToDownload(evidences);

      const { company, property, level, numerCase, caseType, otherSeeReport } = data;

      // Normalizar el nombre de la propiedad para reemplazar los espacios con guiones
      const propertyNormalized = property.name.replace(/\s+/g, "-");

      // Normalizar el nombre del equipo para reemplazar los espacios con guiones
      const companyNormalized = company.replace(/\s+/g, "-");

      // Verifica si el tipo de caso es 'Other See Report' y el ID es 10
      let incidentName;
      if (caseType.id === 10 && caseType.incident === "Other See Report") {
        // Reemplaza comas u otros caracteres especiales por guiones y quita espacios adicionales
        incidentName = otherSeeReport.replace(/[,]/g, "-").trim();
      } else {
        incidentName = caseType.incident;
      }

      // Construir el nombre de la carpeta
      const folder = `report/${companyNormalized}_${propertyNormalized}_Level-${level}_#${numerCase}-${incidentName}.zip`;


      // Actualizar el estado con el nombre de la carpeta generado
      setFolderName(folder);

      console.log("Report data:", data);
    });
  }, [reportSaved]);

  
  const deleteReport = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e6c200",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(url, reportDetails.id, navigate, flag, setFlag).then(
          console.log(
            "Se ha eliminado correctamnete el reporte " +
              reportDetails.numerCase
          )
        );
        Swal.fire("Deleted!", "Your report has been deleted.", "success");
      }
    });
  };

  const checkReport = async () => {
    let reportVerified = await editReport({
      ...reportDetails,
      verified: true,
    });
    setReportDetails(reportVerified);
    setFlag(!flag);
  };

  videos = reportDetails?.evidences?.filter((img) => img.type === "video");
  images = reportDetails?.evidences?.filter((img) => img.type === "image");
  dataImages = images?.map((img) => ({
    original: `${process.env.REACT_APP_S3_BUCKET_URL}/${img?.path}`,
    thumbnail: `${process.env.REACT_APP_S3_BUCKET_URL}/${img?.path}`,
  }));
  dataVideos = videos?.map(
    (vid) => `${process.env.REACT_APP_S3_BUCKET_URL}/${vid?.path}`
  );
  const [incidentType, setIncidentType] = useState("");


  useEffect(() => {
    if (!reportDetails || !reportDetails.caseType) return;
 
    const incidentInCurrentLanguage = i18n.language === 'en' ? reportDetails.caseType.incident : reportDetails.caseType.translate;
    setIncidentType(incidentInCurrentLanguage);
  }, [reportDetails, i18n.language]);


  
  useEffect(() => {
       if (userRole === "Client" && user.id && id) {
      console.log("Condiciones cumplidas para marcar como visto");
      postViewedUser(user.id, id)
        .catch(error => {
          console.error("Error al marcar el reporte como visto:", error);
        });
    } 
  }, [userRole, user.id, id]); 
  

  const handleDownload = async () => {
    setShowButton(false); // Ocultar el botón al comenzar la descarga
    setLoadingevidences(true); // Activar el loader

    const zip = new JSZip();
    const evidencesFolder = zip.folder("Evidences");
    const pdfFolder = zip.folder("Pdf")


    try {
      // Generación del pdf para agregarlo a la descarga
      const pdfBlob = await exportPdfEvidences(reportDetails);
      pdfFolder.file("report.pdf", pdfBlob);

      // Agregar evidencias al ZIP
      const totalFiles = filesToDownload.length;
      let filesProcessed = 0;

      await Promise.all(
        filesToDownload.map(async (file) => {
          const response = await fetch(file.url, {
            method: "GET",
            mode: "cors",
            cache: "no-store", 
          });
          const data = await response.arrayBuffer(); // Obtener el cuerpo de la respuesta como un ArrayBuffer
          evidencesFolder.file(file.name, data);

          // Incrementar el contador de archivos procesados y calcular el progreso
          filesProcessed++;
          const currentProgress = Math.round((filesProcessed / totalFiles) * 100);
          setProgress(currentProgress);
        })
      );

      // Generar el archivo ZIP y descargar
      const content = await zip.generateAsync({ type: "blob" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = folderName; // Nombre del archivo ZIP y la carpeta
      downloadLink.click();
    } catch (error) {
      console.error('Error durante la generación o descarga del archivo ZIP:', error);
      Swal.fire("Error", "Failed to generate or download ZIP file.", "error");
      setLoadingevidences(false);
      setShowButton(true);
    } finally {
      setLoadingevidences(false); // Desactivar el loader una vez que la descarga esté completa
      setProgress(0); // Restablecer el progreso
      setShowButton(true); // Mostrar el botón nuevamente
    }
  };

  const handleOpenEmailDialog = (event) => {
    event.stopPropagation();  
    setSendEmailDialogVisible(true);
  };

  
  const handleCloseEmailDialog = () => {
    setSendEmailDialogVisible(prev => !prev);
  };

  const updateVerificationStatus = (newStatus) => {
    setReportDetails(prevDetails => ({
      ...prevDetails,
      verified: newStatus
    }));
  };

  const isOtherSeeReport = reportDetails.caseType?.id === 10 || reportDetails.caseType?.incident === "Other See Report";
  const incidentToUse = isOtherSeeReport ? reportDetails.otherSeeReport : reportDetails.caseType?.incident;


  return (

      
    <div className="mx-20 md:m-10  md:p-0 bg-white rounded-3xl">
      <div className="w-full flex justify-end">
      <div className="card">
            
      </div>
        <div className="col-xs-12 col-sm-12 col-lg-6 col-md-6">
        
        </div>
      </div>{" "}
      <div>
 
          {/* <div className="flex justify-end">
            <Button
              icon="pi pi-check"
              rounded
              text
              raised
              severity="primary"
              aria-label="Bookmark"
              onClick={() => {
                checkReport();
              }}
            />
            <Button
              icon="pi pi-pencil"
              rounded
              text
              raised
              severity="secondary"
              aria-label="Bookmark"
              onClick={() => {
                setReportFormVisible(true);
              }}
            />
            <Button
              icon="pi pi-times"
              rounded
              text
              raised
              severity="danger"
              aria-label="Bookmark"
              onClick={() => {
                deleteReport();
              }}
            />
          </div> */}
        
        
      

        <div className="px-4 py-3 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-3">
     
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <div className="">
            
              <h6 className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-gray-700 uppercase rounded-full bg-teal-accent-400">
                INNOVA MONITORING
              </h6>
            </div>
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
              
              <span className="relative inline-block">
                
                <svg
                  viewBox="0 0 52 24"
                  fill="currentColor"
                  className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
                >
                  <defs>
                    <pattern
                      id="07690130-d013-42bc-83f4-90de7ac68f76"
                      x="0"
                      y="0"
                      width=".135"
                      height=".30"
                    >
                      <circle cx="1" cy="1" r=".7" />
                    </pattern>
                  </defs>
                  <rect
                    fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                    width="52"
                    height="24"
                  />
                </svg>
                <span className="relative">
                  {t("dashboard.reports.case-details.incident-report")} #{ reportDetails?.numerCase}
                </span>
              </span>
            </h2>
            <p className="text-base text-gray-700 md:text-lg"></p>
          </div>
          <div className="grid max-w-screen-lg mx-auto space-y-2 lg:grid-cols-2 lg:space-y-0 lg:divide-x mb-24">
            <div className="space-y-2 sm:px-4">
              <div className="flex max-w-full border-b-1">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BsBuildings className="text-yellow-600 w-5 h-6"></BsBuildings>
                  </div>
                </div>
                <div className="flex items-center max-w-full ">
                  <h6 className=" text-xl font-bold leading-5">
                    {t("dashboard.reports.case-details.property")}
                  </h6>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.property?.name}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <FiUser className="text-yellow-600 w-5 h-6"></FiUser>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.name")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.createdBy?.name}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiOutlineTeam className="text-yellow-600 w-5 h-6"></AiOutlineTeam>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.company")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.company}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <HiOutlineDocumentReport className="text-yellow-600 w-5 h-6"></HiOutlineDocumentReport>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.incident")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">{incidentType}</p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <FaLevelUpAlt className="text-yellow-600 w-5 h-6"></FaLevelUpAlt>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.level")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.level}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdLocalPolice className="text-yellow-600 w-5 h-6"></MdLocalPolice>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.security-guards-scene")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.securityGuardsScene ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>{" "}
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GiPoliceBadge className="text-yellow-600 w-5 h-6"></GiPoliceBadge>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t(
                      "dashboard.reports.case-details.security-guards-notified"
                    )}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.securityGuardsNotified ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <FaUser className="text-yellow-600 w-5 h-6"></FaUser>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t(
                      "dashboard.reports.case-details.form-notification-client"
                    )}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.formNotificationClient}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GiCctvCamera className="text-yellow-600 w-5 h-6"></GiCctvCamera>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.observed-via-cameras")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.observedViaCameras ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GiCctvCamera className="text-yellow-600 w-5 h-6"></GiCctvCamera>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t(
                      "dashboard.reports.case-details.list-malfuncioning-cameras"
                    )}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.listMalfunctioningCameras}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillCheckCircle className="text-yellow-600 w-5 h-6"></AiFillCheckCircle>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.cameras-functioning")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.camerasFunctioning ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 sm:px-4">
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BsCalendarDate className="text-yellow-600 w-5 h-6"></BsCalendarDate>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.date-of-report")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.dateOfReport}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BiTimeFive className="text-yellow-600 w-5 h-6"></BiTimeFive>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.incident-start-time")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.incidentStartTime}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BiTimeFive className="text-yellow-600 w-5 h-6"></BiTimeFive>
                  </div>
                </div>

                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.incident-end-time")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.incidentEndTime || t('dashboard.reports.case-details.persist')}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BiTimeFive className="text-yellow-600 w-5 h-6"></BiTimeFive>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.time-of-report")}
                  </p>
                  <a className="text-lg text-teal-600 ml-3">
                    {reportDetails?.timeOfReport}
                  </a>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillFilePdf className="text-yellow-600 w-5 h-6"></AiFillFilePdf>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold mr-5">
                    Pdf:
                  </p>
                  <GridPdf {...reportDetails} className="ml-20">
                    <AiFillFilePdf />
                  </GridPdf>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiOutlineNumber className="text-yellow-600 w-5 h-6"></AiOutlineNumber>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.numer-case")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.numerCase}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GoUnverified className="text-yellow-600 w-5 h-6"></GoUnverified>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.verified")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.verified ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdEmail className="text-yellow-600 w-5 h-6"></MdEmail>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.emailed-report")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.emailedReport}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdLocalPolice className="text-yellow-600 w-5 h-6"></MdLocalPolice>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.police-notified")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.policeFirstResponderNotified ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillCheckCircle className="text-yellow-600 w-5 h-6"></AiFillCheckCircle>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t(
                      "dashboard.reports.case-details.police-first-responder-notified"
                    )}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.policeFirstResponderScene ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>

              {reportDetails.policeNumerCase && (
                <div className="flex max-w-full">
                  <div className="mr-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                      <AiFillCheckCircle className="text-yellow-600 w-5 h-6"></AiFillCheckCircle>
                    </div>
                  </div>
                  <div className="flex items-center w-full border-b-1">
                    <p className="text-lg font-bold">
                      {t("dashboard.reports.case-details.police-numer-case")}
                    </p>
                    <p className="text-lg text-gray-900 ml-3">
                      <p className="text-gray-800">
                        {reportDetails.policeNumerCase}
                      </p>
                    </p>
                  </div>
                </div>
              )}

            { (userRole === "Admin") && (

              <div className="flex max-w-full hover-effect">
                <div className="mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdMarkEmailRead className="text-yellow-600 w-5 h-6"></MdMarkEmailRead>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1" onClick={handleOpenEmailDialog}>
                  <p className="text-lg font-bold ">
                    {t("dashboard.reports.case-details.send-and-verfied")}
                  </p>
                </div>

                <Dialog
                  visible={sendEmailDialogVisible}
                  modal
                  dismissableMask
                  onHide={handleCloseEmailDialog}
                  className="dialog-fullscreen"
                  contentStyle={{ borderRadius: '12px', backgroundColor: '#2E2E2E' }}
                >
                  {reportDetails?.caseType && (
                    <SendEmail
                        incidentType={incidentType}
                        caseNumber={reportDetails.numerCase}
                        incidentEnglish={incidentToUse}
                      incidentDate={reportDetails.incidentDate}
                      incidentStartTime={reportDetails.incidentStartTime}
                      images={dataImages}
                      videos={dataVideos}
                      propertyName={reportDetails.property.name}
                      reportId={reportDetails.id}
                      reportVerified={reportDetails.verified}
                      updateVerification={updateVerificationStatus}
                      onHide={handleCloseEmailDialog}
                    />
                  )}
                </Dialog>
              </div>
              )}


            </div>
          </div>
        </div>
      </div>
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            INNOVA MONITORING
          </p>
        </div>
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="07690130-d013-42bc-83f4-90de7ac68f76"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative">
              <p className="text-red-700">
                {t("dashboard.reports.case-details.video-gallery")}
              </p>{" "}
            </span>
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {dataVideos?.map((video) => (
          <div className="flex flex-col items-center w-auto">
            <video controls width="500">
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
      <div className="max-w-xl my-14 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-gray-600 uppercase rounded-full bg-teal-accent-400">
            INNOVA MONITORING
          </p>
        </div>
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="07690130-d013-42bc-83f4-90de7ac68f76"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative">
              {t("dashboard.reports.case-details.image-gallery")}
            </span>
          </span>
        </h2>
      </div>
      <ReactImageGallery
        showNav={false}
        showPlayButton={false}
        items={dataImages ? dataImages : noImages}
      />

        <div>
      {loading ? (
        <TableSkeleton />
      ) : (
        reportDetails.vieweds && reportDetails.vieweds.length > 0 && userRole === "Admin" &&( 
              <ViewedsTable vieweds={reportDetails.vieweds} t={t} />
        )
      )}
    </div>
      <div className="flex justify-center items-center my-4">
        {showButton && (
          <Button onClick={handleDownload} severity="warning" icon="pi pi-save" size="small">
            <p className="text-lg text-white ml-3">
              {t("dashboard.reports.case-details.evidences")}
            </p>
          </Button>
        )}
        {loadingevidences && (
          <CircularProgressWithLabel color="success" value={progress} />
        )}
      </div>

    </div>
  );
};
function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
