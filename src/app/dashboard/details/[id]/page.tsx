import prisma from "@/prisma";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Link,
} from "@chakra-ui/react";
import React from "react";
import VisitsChart from "./VisitsChart";
import { format, subDays } from "date-fns";
import VisitsTable from "./VisitsTable";
import VisitRepository from "@/repositories/VisitRepository";
import currentUser from "@/helpers/currentUser";
import { redirect } from "next/navigation";
import Container from "@/components/Container";

export default async function Details({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/dashboard/signin");
  }

  const url = await prisma.url.findFirstOrThrow({
    where: {
      id,
      userId: user.id,
    },
    include: {
      _count: {
        select: { visits: true },
      },
    },
  });

  const visitsByDay = await VisitRepository.visitsByDayForUrl(id);

  const now = new Date();
  const timeseries = [...Array(7)]
    .map((_, i) => {
      const date = format(subDays(now, i), "yyyy-MM-dd");

      return {
        date,
        visits: Number(visitsByDay.find((r) => r.date == date)?.visits || 0),
      };
    })
    .reverse();

  const visitsByCountry = await VisitRepository.visitsByCountryForUrl(id);

  return (
    <Container darkBackground>
      <Card mt={4}>
        <CardHeader pb={0}>
          <Heading size="md">{url.title}</Heading>
        </CardHeader>

        <CardBody pt={2}>
          <Link
            href={`http://localhost:3000/${url.id}`}
            display={"block"}
            color={"blue.600"}
            target="_blank"
          >
            http://localhost:3000/{url.id}
          </Link>

          <Link href={url.url} display={"block"} target="_blank">
            {url.url}
          </Link>

          <Box>Visits: {url._count.visits}</Box>

          {url._count.visits ? (
            <>
              <Box h={200} mt={4}>
                <VisitsChart
                  data={[
                    {
                      label: "Visits",
                      data: timeseries,
                    },
                  ]}
                />
              </Box>

              <Box mt={4}>
                <VisitsTable data={visitsByCountry} />
              </Box>
            </>
          ) : (
            <Box textAlign="center" fontWeight="bold" pt={2}>
              No data
            </Box>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
