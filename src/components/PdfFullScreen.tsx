"use client"
import { Expand, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { useState } from "react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

interface PdfFullscreenProps{
    fileUrl: string;
}

const PdfFullScreen = ({fileUrl}: PdfFullscreenProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [numPages, setNumPages] = useState<number>();

    const {toast} = useToast();
    const {width, ref} = useResizeDetector();

  return (
    <Dialog open={isOpen} onOpenChange={(v)=>{
        if(!v)
            setIsOpen(v);
    }}>
        <DialogTrigger asChild onClick={()=>setIsOpen(true)}>
            <Button variant={"ghost"} aria-label="fullscreen"><Expand className="w-4 h-4"/></Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl w-full">
            <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
            <div ref={ref}>
                <Document loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin"/>
                  </div>
                } onLoadError={()=>{
                  toast({
                    title:"Error loading the PDF",
                    description:"Please try again later !",
                    variant:"destructive",
                  });
                }} onLoadSuccess={({numPages})=>{
                    setNumPages(numPages)
                }} file={fileUrl} className="max-h-full">
                   {new Array(numPages).fill(0).map((_, index)=>(
                        <Page key={index} width={width ? width:1} pageNumber={index+1}/>
                    ))}
                </Document>
            </div>
            </SimpleBar>
        </DialogContent>
    </Dialog>
  )
}

export default PdfFullScreen