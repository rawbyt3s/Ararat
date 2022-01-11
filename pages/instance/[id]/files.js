import Router, { useRouter } from "next/router";
import { Typography, Paper, Button, Grid, Checkbox, Container, CircularProgress, Skeleton } from "@mui/material";
import useSWR from "swr";
import nookies from "nookies"
import { Suspense, useEffect, useState } from "react";
import axios from "axios"
import prettyBytes from "pretty-bytes";
import moment from "moment"
import Link from "next/link";
import File from "../../../components/instance/files/file";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const FileEditor = dynamic(import("../../../components/instance/files/FileEditor"), { ssr: false });
export default function Files(props) {
    const [checked, setChecked] = useState([])
    const [allChecked, setAllChecked] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [theFiles, setTheFiles] = useState([])
    const router = useRouter();
    Router.onRouteChangeStart = () => {
        setChecked([])
        setAllChecked(false)
        setShowOptions(false)
    }
    var { id, path } = router.query;
    if (path == undefined) {
        path = "/";
    }
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const { data: files, error } = useSWR(() => id ? `/api/v1/client/instances/${id}/files?path=${path.replace("//", "/")}` : null, fetcher)
    function HandleClicked(e) {
        console.log(checked)
        e.preventDefault();
        console.log(e.target)
        console.log(e.target.id)
        if (e.target.localName == "input") {
            console.log("checkbox")
            var tempChecked = checked;
            if (tempChecked.includes(e.target.id)) {
                tempChecked.splice(tempChecked.indexOf(e.target.id), 1)
                if (tempChecked.length == 0) {
                    setShowOptions(false)
                }
            } else {
                tempChecked.push(e.target.id);
                setShowOptions(true)
            }
            console.log(tempChecked)
            setChecked(tempChecked);
        } else {
            console.log(e.target)
            router.push(`/instance/${id}/files?path=${path}/${e.target.innerText}`.replace("//", "/"))
        }
    }

    return (
        <>
            {files ? console.log("THE FILES:", files) : ""}
            {error ? console.log("ERROR:", error) : ""}
            <Container>
                <Grid xs={12} container direction="row">
                    <Grid item container xs={.6}>
                        {files ? files.list ? <Checkbox checked={allChecked} onClick={(e) => {
                            e.preventDefault();
                            setAllChecked(!allChecked);
                            setChecked([]);
                            setShowOptions(!allChecked)
                        }} sx={{ mt: "auto", mb: "auto" }} /> : <Typography sx={{ mt: "auto", mb: "auto" }}>
                            <FontAwesomeIcon onClick={() => {
                                    var arr = path.split("/").slice("/")
                                    arr.pop()
                                    var newPath = arr.join("/").replace("//", "/")
                                    router.push(`/instance/${id}/files?path=${newPath}`)
                            }} style={{cursor: "pointer"}} icon={faArrowLeft} /> 
                            </Typography> : <CircularProgress size={15} color="info" sx={{ mt: "auto", mb: "auto" }} />}
                    </Grid>
                    <Grid item container xs={6}>
                        <Grid container direction="row" item xs={12} sx={{mt: "auto", mb: "auto"}}>
                        <Link href={`/instance/${id}/files`}>
                        <Typography sx={{cursor: "pointer"}} variant="body2">/</Typography>
                        </Link>
                        {path.split("/").map((item, index) => {
                            console.log(item)
                            return (
                            <>
                            <Link href={`/instance/${id}/files?path=${path.split("/").slice(0, index + 1).join("/").replace("//", "/")}`}>
                            {item == "" ? "" : <Typography style={{cursor: "pointer"}} variant="body2">&nbsp;{(item + " /")} </Typography>}
                            </Link>
                            </>
                            )
                        })}
                        </Grid>
                    </Grid>
                    <Grid item container xs={5.4}>
                        {files ? files.list ? showOptions? <><Button sx={{ mt: "auto", mb: "auto", ml: "auto" }} variant="contained" color="error">Delete</Button> <Button sx={{ mt: "auto", mb: "auto", ml: 3 }} variant="contained" color="warning">Move</Button><Button sx={{ mt: "auto", mb: "auto", ml: 3 }} variant="contained" color="success">Download</Button></>:
                        <>
                        <Button variant="contained" color="info" sx={{ mt: "auto", mb: "auto", ml: "auto" }}>Create Directory</Button>
                        <Button variant="contained" color="info" sx={{ mt: "auto", mb: "auto", ml: 3 }}>Upload</Button>
                        <Button variant="contained" color="info" sx={{ mt: "auto", mb: "auto", ml: 3 }}>New File</Button>
                        </>
                        :                         <Button variant="contained" color="info" sx={{ mt: "auto", mb: "auto", ml: "auto" }}>Open In Visual Studio Code</Button>         :""           }
                    </Grid>
                </Grid>
                <Grid xs={12} container sx={{ mt: 1 }}>
                    {!files ? <><Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" />
                        <Skeleton sx={{ width: "100%", height: "50px" }} animation="wave" /></> : <></>}
                    {files && files.list ? files.list.map((file) => {
                        /*                 if (file.lastModified) {
                                            //if time is less than a day
                                            if (moment().diff(moment(file.lastModified), 'days') < 1) {
                                                //print fromNow
                                                var time = moment(file.lastModified).fromNow()
                                            } else {
                                                //print date
                                                var time = moment(file.lastModified).format("MMMM Do YYYY, h:mm:ss A")
                                            }
                                        } */
                        return (
                            <Grid xs={12} id={file.name} key={file.name} container direction="row" sx={{ backgroundColor: "#141c26", mb: .2, cursor: "pointer" }} onClick={HandleClicked}>
                                <File file={file} allChecked={allChecked} />
                            </Grid>
                        )
                    }) : ""}
                    {files && files.list ? files.list.length == 0 ?<>
                    <Grid direction="column" container>
                     <Typography variant="h6" sx={{ m: "auto" }}>Directory is Empty</Typography> 
                    <Button onClick={() => {
                        var arr = path.split("/").slice("/")
                        arr.pop()
                        var newPath = arr.join("/").replace("//", "/")
                        router.push(`/instance/${id}/files?path=${newPath}`)
                    }} sx={{width: "30%", mt: 2, mr: "auto", ml: "auto"}} variant="contained" color="primary">Go Back</Button>
                    </Grid></>: "" : ""}
                    {files ? typeof (files) != "object" ? <Grid xs={12} container><FileEditor file={files} path={path} instance={id} /></Grid> : "" : ""}
                </Grid>
            </Container>
        </>
    )
}