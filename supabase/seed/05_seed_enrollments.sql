-- Seed Enrollments
-- Creates test enrollments for student 1 (Ana Popescu)
-- This will populate the student dashboard with realistic data

-- Enrollment 1: STEM Mentorship (Active, with attendance, ACCEPTED with custom welcome message)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  attendance_validated_at,
  validated_by,
  motivation,
  availability,
  experience,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '770e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  '11111111-1111-1111-1111-111111111111',
  'CONFIRMED',
  '2025-11-10 14:30:00',
  'PRESENT',
  '2025-11-10 20:05:00',
  '33333333-3333-3333-3333-333333333333',
  'Sunt pasionată de educație STEM și vreau să inspir elevii să urmeze cariere în tehnologie. Am experiență ca tutore de matematică în liceu.',
  'Disponibilă în fiecare marți și joi după-amiaza între 16:00-19:00. Flexibilă pentru weekenduri dacă e nevoie.',
  'Am participat ca voluntar la 2 programe de mentorat STEM anul trecut. Am lucrat cu 15 elevi de gimnaziu și liceu.',
  'Felicitări Ana! Am analizat cu atenție aplicația ta și suntem încântați să te avem în echipă. Vom lua legătura în curând cu detalii despre primii pași.',
  '2025-11-10 14:35:00',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 2: Community Outreach (Active, pending attendance, ACCEPTED with standard message)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '770e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440002',
  '11111111-1111-1111-1111-111111111111',
  'CONFIRMED',
  '2025-11-12 09:15:00',
  'PENDING',
  'Vreau să ajut comunitatea locală și să fac o diferență în viețile oamenilor. Am văzut nevoia de suport în zonele vulnerabile.',
  'Disponibilă în weekenduri, sâmbăta și duminica, între 09:00-17:00.',
  'Nou în voluntariat, dar sunt motivată să învăț și să contribui cât pot de mult.',
  'Felicitări! Aplicația ta a fost acceptată. Te așteptăm cu drag!',
  '2025-11-12 09:20:00',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 3: Math Tutoring (Active, with attendance, ACCEPTED with enthusiastic message)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  attendance_validated_at,
  validated_by,
  motivation,
  availability,
  experience,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '770e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440004',
  '11111111-1111-1111-1111-111111111111',
  'CONFIRMED',
  '2025-11-08 10:00:00',
  'PRESENT',
  '2025-11-08 18:10:00',
  '33333333-3333-3333-3333-333333333333',
  'Matematica este pasiunea mea și vreau să ajut elevii să înțeleagă frumusețea ei. Am observat că mulți elevi se luptă cu algebra și vreau să-i sprijin.',
  'Disponibilă luni, miercuri, vineri după cursuri, între 15:00-18:00.',
  'Am fost tutore de matematică pentru 3 colegi anul trecut. Notele lor au crescut cu o medie de 2 puncte.',
  'Excelente vești Ana! Aplicația ta a fost acceptată și suntem foarte entuziasmați să colaborăm cu tine. Abia așteptăm să începem această experiență împreună!',
  '2025-11-08 10:05:00',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 4: Cultural Festival (Completed, ACCEPTED with custom edited message)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  attendance_validated_at,
  validated_by,
  feedback_submitted,
  motivation,
  availability,
  experience,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '770e8400-e29b-41d4-a716-446655440004',
  '660e8400-e29b-41d4-a716-446655440005',
  '11111111-1111-1111-1111-111111111111',
  'CONFIRMED',
  '2025-10-01 08:00:00',
  'PRESENT',
  '2025-10-15 18:30:00',
  '33333333-3333-3333-3333-333333333333',
  true,
  'Iubesc diversitatea culturală și vreau să promovez înțelegerea între culturi. Am experiență în organizarea de evenimente culturale.',
  'Flexibilă pentru toate etapele festivalului. Pot dedica 10-15 ore pe săptămână pentru pregătiri.',
  'Am organizat 2 evenimente culturale în liceu. Am coordonat o echipă de 12 voluntari pentru Zilele Multiculturale.',
  'Bună Ana! Aplicația ta excelentă ne-a impresionat foarte mult. Experiența ta în organizarea de evenimente și pasiunea pentru diversitate culturală sunt exact ce căutăm. Te așteptăm la prima întâlnire de planificare!',
  '2025-10-01 08:10:00',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 5: River Cleanup (PENDING - not yet reviewed)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience
) VALUES (
  '770e8400-e29b-41d4-a716-446655440005',
  '660e8400-e29b-41d4-a716-446655440003',
  '11111111-1111-1111-1111-111111111111',
  'PENDING',
  '2025-11-15 16:20:00',
  'PENDING',
  'Sunt pasionată de protecția mediului și vreau să contribui la curățarea râurilor locale. Poluarea apei este o problemă serioasă.',
  'Disponibilă în weekend, sâmbăta între 08:00-14:00.',
  'Am participat la 3 acțiuni de curățare a parcurilor în anul trecut cu NGO-ul EcoTineret.'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 6: Student 2 - Community Outreach (CONFIRMED)
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '770e8400-e29b-41d4-a716-446655440006',
  '660e8400-e29b-41d4-a716-446655440002',
  '22222222-2222-2222-2222-222222222222',
  'CONFIRMED',
  '2025-11-11 11:00:00',
  'PENDING',
  'Vreau să fac parte din comunitatea de voluntari și să ajut persoanele în nevoie.',
  'Disponibil în weekenduri.',
  'Experiență anterioară în organizarea de campanii de donații.',
  'Felicitări! Aplicația ta a fost acceptată. Te așteptăm cu drag!',
  '2025-11-11 11:05:00',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 7: Student 1 - CANCELLED/REJECTED with reason and empathetic message
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience,
  rejection_reason,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '770e8400-e29b-41d4-a716-446655440007',
  '660e8400-e29b-41d4-a716-446655440001',
  '22222222-2222-2222-2222-222222222222',
  'CANCELLED',
  '2025-11-14 10:30:00',
  'PENDING',
  'Vreau să contribui la educația tinerilor în domeniul STEM.',
  'Disponibil doar în weekend.',
  'Fără experiență anterioară în mentorat.',
  'Insuficientă experiență',
  'Îți mulțumim sincer pentru interesul manifestat față de această activitate. După o analiză atentă a tuturor aplicațiilor primite, am decis să mergem înainte cu alți candidați care au experiență anterioară în mentorat STEM. Te rugăm să nu te descurajezi - competiția a fost strânsă și apreciem foarte mult timpul pe care l-ai dedicat aplicației tale. Te încurajăm să aplici pentru alte oportunități din platformă unde experiența ta poate fi valorificată mai bine. Rămânem deschiși la colaborări viitoare!',
  '2025-11-14 10:35:00',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Enrollment 8: Student 2 - WAITLISTED with encouraging message
INSERT INTO public.enrollments (
  id,
  activity_id,
  user_id,
  status,
  enrolled_at,
  attendance_status,
  motivation,
  availability,
  experience,
  rejection_reason,
  custom_message,
  reviewed_at,
  reviewed_by
) VALUES (
  '770e8400-e29b-41d4-a716-446655440008',
  '660e8400-e29b-41d4-a716-446655440004',
  '22222222-2222-2222-2222-222222222222',
  'WAITLISTED',
  '2025-11-13 14:20:00',
  'PENDING',
  'Vreau să ajut elevii să înțeleagă matematica mai bine.',
  'Disponibil după orele 17:00 în zilele de lucru.',
  'Am ajutat câțiva colegi cu temele de matematică.',
  'Poziția a fost ocupată',
  'Îți mulțumim pentru aplicația ta! Locurile disponibile au fost ocupate, dar te-am adăugat în lista de așteptare. Dacă se eliberează un loc, te vom contacta imediat. Te încurajăm să te uiți și la alte oportunități similare din platformă. Mult succes!',
  '2025-11-13 14:25:00',
  '33333333-3333-3333-3333-333333333333'
) ON CONFLICT (id) DO NOTHING;

-- Verify enrollments for student 1
SELECT
  e.id,
  e.status,
  e.attendance_status,
  a.title as activity_title,
  a.status as activity_status
FROM public.enrollments e
JOIN public.activities a ON e.activity_id = a.id
WHERE e.user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY e.enrolled_at DESC;
