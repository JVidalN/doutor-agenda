import dayjs from "dayjs";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { sum } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { DatePicker } from "./_components/date-picker";
import StatsCards from "./_components/stats-cards";

interface DashboardProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  const { from, to } = await searchParams;
  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }

  console.log(from, to);

  const [
    [{ totalRevenue, totalAppointments }],
    [{ totalPatients }],
    [{ totalDoctors }],
  ] = await Promise.all([
    db
      .select({
        totalRevenue: sum(appointmentsTable.appointmentPriceInCents),
        totalAppointments: count(),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    db
      .select({
        totalPatients: count(),
      })
      .from(patientsTable)
      .where(eq(patientsTable.clinicId, session.user.clinic.id)),
    db
      .select({
        totalDoctors: count(),
      })
      .from(doctorsTable)
      .where(eq(doctorsTable.clinicId, session.user.clinic.id)),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Acesse uma visão geral detalhada das principais métricas e
            resultados dos pacientes.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCards
          totalRevenue={totalRevenue ? Number(totalRevenue) : null}
          totalAppointments={totalAppointments}
          totalPatients={totalPatients}
          totalDoctors={totalDoctors}
        />
      </PageContent>
    </PageContainer>
  );
}
