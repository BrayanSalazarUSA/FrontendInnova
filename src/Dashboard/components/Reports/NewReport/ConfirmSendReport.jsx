import React from 'react';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { postReport } from '../../../helper/postReport';
import "../../../pages/css/Reports/NewReport.css"

const ConfirmSendReport = ({ properties, reportData, setCreatingReport, navigate, resetReportForm, user, setShowConfirmDialog, setPropertyContext, isOtherSeeReportActive }) => {
    const [t] = useTranslation("global");
    const [selectedProperty, setSelectedProperty] = React.useState(null); 
    const handleConfirm = async () => {
        if (!selectedProperty || selectedProperty.id !== reportData.property.id) {
            Swal.fire({
                icon: "error",
                title: t("dashboard.reports.new-report.swal.wrong-property"),
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    container: 'wrong-property'
                }
            });
            return;
        }

        navigate("/dashboard/reports");
        setCreatingReport(true);
        const updateContext = () => setPropertyContext(selectedProperty); 
        await postReport({ ...reportData, property: selectedProperty, isOtherSeeReportActive: isOtherSeeReportActive }, t, setCreatingReport, user.id, updateContext);
        resetReportForm();
        setShowConfirmDialog(false);
    };

    const handleDeny = () => {
        resetReportForm();
        setShowConfirmDialog(false);
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };


    return (
        <div className="confirm-send-report">
            <h3 className='mb-4'>{t("dashboard.reports.new-report.swal.confirmation")}</h3>
            <Dropdown
                value={selectedProperty}
                options={properties}
                onChange={(e) => setSelectedProperty(e.value)}
                optionLabel="name"
                placeholder={t("dashboard.reports.new-report.select-property")}
                filter
                showClear
                filterBy="name"
                className="w-full"
            />
            <div className="button-container"> 
                
                <Button
                    label={t("dashboard.reports.new-report.swal.cancel")}
                    icon="pi pi-times"
                    className="p-button-text mr-2"
                    onClick={handleCancel}
                />
                <Button
                    label={t("dashboard.reports.new-report.swal.don't-save")}
                    icon="pi pi-times-circle"
                    className="p-button-danger mr-2 mx-4"
                    onClick={handleDeny}
                />
                <Button
                    label={t("dashboard.reports.new-report.swal.send")}
                    icon="pi pi-check"
                    className="p-button-info"
                    onClick={handleConfirm}
                />
            </div>
        </div>
    );
};

export default ConfirmSendReport;