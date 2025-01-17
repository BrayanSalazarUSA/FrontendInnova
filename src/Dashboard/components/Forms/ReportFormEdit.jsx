import React, { useContext, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { UserContext } from "../../../context/UserContext";
import { useTranslation } from "react-i18next";


export const ReportFormEdit = ({properties, agents, incidents}) => {
  const [t] = useTranslation("global");
  const { reportForm, setReportForm } = useContext(UserContext);
  const { property, agent, dateOfReport, timeOfReport, caseType, evidences,level, company, numerCase, images, videos} = reportForm;

  let agentsList = agents.map(agen => ({id:agen.id, image:agen.agent.image, lastName:agen.lastName, name:agen.name}))

let caseTypeMapped = {...caseType, caseType};

  let fecha = new Date(dateOfReport)
  let fecha2 = new Date(`09-24-2023 ${timeOfReport}:00`)



  const levels = [
   "Level 1", "Level 2", "Level 3", "Level 4"
  ];

  const team = [
     "Innova Monitoring",
     "Impro",
  ];

  return (
    <div>
      <div className="flex">
        <div className="p-inputgroup my-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-calendar"></i>
          </span>
          <Dropdown
            value={property}
            defaultValue={"Cordoba Courts"}
            onChange={(e) =>
              setReportForm((i) => {
         
                return { ...reportForm, property:e.value };
              })
            }
            options={properties}
            optionLabel="name" 
         /*    optionValue="name" */
            placeholder={t("dashboard.reports.edit-report.property")}
            className="w-full md:w-14rem"
          />

        </div>

        <div className="p-inputgroup my-3 ml-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown
            value={agent}
            onChange={(e) => setReportForm((i) => {
         
              return { ...reportForm, agent:e.value };
            })}
            options={agentsList}
            optionLabel="name"
            placeholder={t("dashboard.reports.edit-report.agent")}
            className="w-full md:w-14rem"
          />
        </div>
      </div>

      <div className="flex">
        <div className="p-inputgroup my-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-clock"></i>
          </span>
          <Calendar
            placeholder={t("dashboard.reports.edit-report.date")}
            value={fecha}
            onChange={(e) => setReportForm((i) => {
             
              return { ...reportForm, dateOfReport:e.value };
            })}
          />
        </div>

        <div className="p-inputgroup my-3 ml-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Calendar
            placeholder={t("dashboard.reports.edit-report.time")}
            value={fecha2}
            onChange={(e) =>  {
              console.log(e.value)
            }}
            timeOnly
          />
        </div>
      </div>

      <div className="flex">
        <div className="p-inputgroup my-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown
            value={caseTypeMapped}
          
            onChange={(e) => setReportForm((i) => {
           
              return { ...reportForm, caseType:e.value };
            })}
            options={incidents}
            optionLabel="incident"
            placeholder={t("dashboard.reports.edit-report.incident")}
            className="w-full md:w-14rem"
          />
        </div>
        <div className="p-inputgroup my-3 ml-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown
            value={level}
            onChange={(e) => setReportForm((i) => {
            
              return { ...reportForm, level:e.value };
            })}
            options={levels}
            placeholder={t("dashboard.reports.edit-report.level")}
            className="w-full md:w-14rem"
          />
        </div>
      </div>

      <div className="flex">
        <div className="p-inputgroup my-3 ">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown

            value={company}
            onChange={(e) => setReportForm((i) => {
        
              return { ...reportForm, company:e.target.value };
            })}
            options={team}
            placeholder={t("dashboard.reports.edit-report.monitoring-team")}
            className="w-full md:w-14rem"
          />
        </div>

        <div className="p-inputgroup my-3 ml-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-hashtag"></i>
          </span>
          <InputText value={numerCase} onChange={(e) => setReportForm((i) => {
              return { ...reportForm, numerCase:e.target.value };
          })} placeholder={t("dashboard.reports.edit-report.number-case")} />
        </div>
      </div>
    </div>
  );
};

