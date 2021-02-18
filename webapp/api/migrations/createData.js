const sql =
	`
-- TABLESPACE pg_default;
DROP TABLE IF EXISTS public.appointments;
DROP TABLE IF EXISTS public.doctors;
--
DROP SEQUENCE IF EXISTS "doctors_id_seq";
CREATE SEQUENCE public.doctors_id_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
--
DROP SEQUENCE IF EXISTS "appointments_id_seq";
CREATE SEQUENCE public.appointments_id_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
-- Table: public.doctors
CREATE TABLE public.doctors (
    id integer NOT NULL DEFAULT nextval('doctors_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    role character varying(50) COLLATE pg_catalog."default" NOT NULL,
    pic character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT doctors_pkey PRIMARY KEY (id)
);
-- Table: public.appointments
CREATE TABLE public.appointments (
    id integer NOT NULL DEFAULT nextval('appointments_id_seq'::regclass),
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    patient_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    procedure character varying(50) COLLATE pg_catalog."default",
    doctor_id integer NOT NULL,
    CONSTRAINT appointments_pkey PRIMARY KEY (id),
    CONSTRAINT fk_doc_app FOREIGN KEY (doctor_id) REFERENCES public.doctors (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE NOT VALID
);
INSERT INTO public.doctors (id, name, role, pic)
VALUES (
        1,
        'Vaidotas Kniuras',
        'Programuotojas',
        'https://picsum.photos/id/1/100/100'
    ),
    (
        2,
        'Jonas Petrauskas',
        'Urologas',
        'https://picsum.photos/id/20/100/100'
    ),
    (
        3,
        'Petras Karulis',
        'Kardiologas',
        'https://picsum.photos/id/30/100/100'
    );
INSERT INTO public.appointments (
        "start",
        "end",
        "patient_name",
        "procedure",
        "doctor_id"
    )
VALUES 
    (now(), now() + '1 hour', 'John', 'regular', 1),
    (now() + '7 hour', now() + '9 hour', 'John1', 'special 1', 1),
    (now() + '7 hour', now() + '9 hour', 'John2', 'special 2', 2),
    (now() + '7 hour', now() + '9 hour', 'John3', 'regular 3', 3),
    (
        now() + '3 hour',
        now() + '4 hour',
        'Mike',
        'not pleasant',
        2
    ),
    (
        now() + '5 hour',
        now() + '6 hour',
        'Andrew',
        'lovely',
        3
    );
`

module.exports = {
	sql
}
