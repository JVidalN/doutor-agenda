import { z } from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    specialty: z
      .string()
      .trim()
      .min(1, { message: "Especialidade é obrigatória" }),
    appointmentPriceInCents: z
      .number()
      .min(1, { message: "Preço de consulta é obrigatório" }),
    availableFromWeekDay: z.number().min(1).max(6),
    availableToWeekDay: z.number().min(1).max(6),
    availableFromTime: z
      .string()
      .trim()
      .min(1, { message: "Horário de início é obrigatório" }),
    availableToTime: z
      .string()
      .trim()
      .min(1, { message: "Horário de término é obrigatório" }),
  })
  .refine(
    (data) => {
      const fromTime = new Date(`1970-01-01T${data.availableFromTime}`);
      const toTime = new Date(`1970-01-01T${data.availableToTime}`);
      return fromTime < toTime;
    },
    {
      message: "Horário inicial deve ser menor que o horário final",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
