"use client";

import {Breadcrumbs, Grid, Typography} from "../../../../../components/base";
import Table from "../../../../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder, faFileImage, faFilePdf, faFileWord, faFilePowerpoint, faFileExcel, faFileCsv, faFileAudio, faFileVideo, faFileArchive, faFileCode, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import getClassNameForExtension from 'font-awesome-filetypes'
import Link from "next/link";


export default function FilesTable({files, path, id}) {
    function getIcon(code) {
        if (code == "fa-file") return faFile;
        if (code == "fa-folder") return faFolder;
        if (code == "fa-file-image") return faFileImage;
        if (code == "fa-file-pdf") return faFilePdf;
        if (code == "fa-file-word") return faFileWord;
        if (code == "fa-file-powerpoint") return faFilePowerpoint;
        if (code == "fa-file-excel") return faFileExcel;
        if (code == "fa-file-csv") return faFileCsv;
        if (code == "fa-file-audio") return faFileAudio;
        if (code == "fa-file-video") return faFileVideo;
        if (code == "fa-file-archive") return faFileArchive;
        if (code == "fa-file-code") return faFileCode;
        if (code == "fa-file-alt") return faFileAlt;
        if (code == "fa-file-file") return faFile;
    }
    let rows = [];
    let rowLinks = [];
    files.forEach((file) => {
        const icon = getClassNameForExtension(file.Name.split(".").pop());
        let filePath = (path + "/" + file.Name).replace("//", "/");
        rowLinks.push({"link": `/instance/${id}/files?path=${filePath}`, "prefetch": false})
        rows.push([
            <Grid sx={{maxWidth: "20px", m: "auto"}}>
                {!file.IsDir ?
                <FontAwesomeIcon icon={getIcon(icon)} style={{  color: "grey" }} />
:                 <FontAwesomeIcon icon={file.IsDir ? faFolder : faFile} style={{  color: "grey" }} />
        }
            </Grid>,
            <Typography sx={{m: "auto"}} fontWeight="bold">{file.Name}</Typography>,
            <Typography sx={{m: "auto"}}>{file.Size}</Typography>,
            <Typography sx={{m: "auto"}}>{file.ModTime}</Typography>
        ])
    })
    return (
        <>
        <Table columns={[
                        {
                            title: "Icon",
                            sizes: {
                                xs: 1
                            }
                        },
            {
                title: "Name",
                fontWeight: 500,
                sizes: {
                    xs: 4
                }
            },
            {
                title: "Size",
                sizes: {
                    xs: 3
                }
            },
            {
                title: "Last Modified",
                sizes: {
                    xs: 3
                }
            },
        ]} rows={rows} top={
            <Grid xs={5} sx={{marginTop: "auto", marginBottom: "auto", ml: 2}} container>
                 <Link prefetch={false} href={`/instance/${id}/files?path=/`} style={{textDecoration: "none", color: "rgba(255, 255, 255, 0.7)", marginTop: "auto", marginBottom: "auto", marginRight: "10px"}}>
                            {"/"}
                        </Link>
            <Breadcrumbs sx={{my: "auto"}}>
                {path.split("/").map((item, index) => {
                    if (item == "") return;
                   let newPath = path.split("/").slice(0, index + 1).join("/");
                    return (
                        <Link prefetch={false} href={`/instance/${id}/files?path=${newPath}`} style={{textDecoration: "none", color: "inherit"}}>
                            {item}
                        </Link>
                    )
                })
            }
            </Breadcrumbs>
            </Grid>
         } rowLinks={rowLinks} />
        </>
    )
}