"use client";

import Heading from "@/components/Heading";
import { ImageAnalysis } from "@myconid/store/types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  analysis?: ImageAnalysis;
};
const AnalysisResults: React.FC<Props> = ({ analysis }) => {
  const isIdentified = !!analysis;
  const router = useRouter();

  const dataFields: { label: ReactNode; value: ReactNode }[] = [];

  if (isIdentified) {
    if (analysis?.lookAlikes?.length) {
      dataFields.push({
        label: "Look-alikes",
        value: analysis?.lookAlikes?.map((la, idx, arr) => (
          <>
            <a key={idx} href={la.url}>
              {la.name}
            </a>
            {idx < arr.length - 1 && <br />}
          </>
        )),
      });
    }

    if (analysis?.traits?.edibility != undefined) {
      dataFields.push({
        label: "Edibility",
        value: analysis?.traits?.edibility,
      });
    }

    if (analysis?.traits?.psychoactive != undefined) {
      dataFields.push({
        label: "Psychoactive",
        value: analysis?.traits?.psychoactive ? "Yes" : "No",
      });
    }
  }

  if (!isIdentified) {
    return (
      <>
        <div className="w-full">
          <Heading level="h1" tag="h2" className="flex flex-col mb-3">
            Unidentified
          </Heading>
          <p className="mb-2">
            The uploaded image did not match with anything in the current
            database.
          </p>

          <p className="mb-2">
            If you’re sure this is an image of a mushroom, try these steps:
          </p>

          <ul className="list-disc pl-6">
            <li>Take another photo with better lighting</li>
            <li>Take another photo with a bright, monotone background</li>
            <li>Try a different angle</li>
          </ul>

          <Button onClick={() => router.push("/account")}>
            Return to your dashboard
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between gap-x-4 w-full">
        <Heading level="h1" tag="h2" className="flex flex-col">
          {analysis.taxonomy?.genus && (
            <span className="block text-[.55em] font-medium">
              {analysis.taxonomy?.genus}
            </span>
          )}
          <span>{analysis.taxonomy?.family}</span>
          {analysis.commonNames?.length && (
            <span className="text-sm">
              Other names:{" "}
              <span className="font-normal">
                {analysis.commonNames?.join(", ")}
              </span>
            </span>
          )}
        </Heading>

        {analysis.isMushroom?.confidence && (
          <div className="text-center">
            <div className="text-xs">Confidence</div>
            <div className="text-3xl">
              {(analysis.isMushroom?.confidence * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </div>

      <Table className="mt-3">
        <TableBody>
          {dataFields.map((df, idx) => (
            <TableRow key={idx} className="items-start">
              <TableCell className="font-medium align-top pl-0">
                {df.label}
              </TableCell>
              <TableCell className="text-right align-top pr-0">
                {df.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AnalysisResults;
