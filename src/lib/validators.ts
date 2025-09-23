import { z } from "zod"

export const technologyInput = z.object({
name: z.string().min(1),
slug: z.string().min(1),
category: z.string().optional(),
iconUrl: z.string().url().optional(),
})

export const projectInput = z.object({
title: z.string().min(1),
slug: z.string().min(1),
keywords: z.array(z.string()).default([]),
teamSize: z.number().int().positive().optional(),
durationMonths: z.number().int().positive().optional(),
startDate: z.string().datetime().optional(),
endDate: z.string().datetime().optional(),
description: z.string().optional(),
keyPoints: z.array(z.string()).default([]),
favorite: z.boolean().optional(),
logoUrl: z.string().url().optional(),
technologySlugs: z.array(z.string()).default([]),
})

export const experienceInput = z.object({
title: z.string().min(1),
place: z.string().optional(),
kind: z.enum(["FULL_TIME","PART_TIME","INTERNSHIP","APPRENTICESHIP","FREELANCE","VOLUNTEER","OTHER"]).default("OTHER"),
description: z.string().optional(),
durationMonths: z.number().int().positive().optional(),
startDate: z.string().datetime().optional(),
endDate: z.string().datetime().optional(),
keyAchievements: z.array(z.string()).default([]),
technologySlugs: z.array(z.string()).default([]),
})

export const engagementInput = z.object({
title: z.string().min(1),
place: z.string().optional(),
kind: z.enum(["ASSOCIATION","VOLUNTEER","LEADERSHIP","EVENT","COMMUNITY","OTHER"]).default("OTHER"),
description: z.string().optional(),
durationMonths: z.number().int().positive().optional(),
startDate: z.string().datetime().optional(),
endDate: z.string().datetime().optional(),
keyAchievements: z.array(z.string()).default([]),
technologySlugs: z.array(z.string()).default([]),
})