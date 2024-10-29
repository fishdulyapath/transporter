# transporter

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```


docker buildx build --platform linux/amd64 --push -t minorsoft/transpoter:latest .


CREATE TABLE ts_car
(
  roworder serial,
  code character varying(255) NOT NULL,
  province character varying(255),
  brand character varying(255),
  car_type character varying(255),
  register_date timestamp without time zone DEFAULT now(),
  create_datetime timestamp without time zone DEFAULT now(),
  CONSTRAINT ts_car_pk PRIMARY KEY (roworder)
);

CREATE TABLE ts_documents
(
  roworder serial,
  doc_no character varying(255) NOT NULL,
  doc_date date,
  creator_code character varying(255),
  remark text,
  car_code character varying(255),
  return_date date,
  driver1 character varying(255),
  driver2 character varying(255),
  start_mileage1 numeric,
  end_mileage1 numeric,
  total_mileage1 numeric,
  total_mileage_before1 numeric,
  total_mileage_current1 numeric,
  start_mileage2 numeric,
  end_mileage2 numeric,
  total_mileage2 numeric,
  total_mileage_before2 numeric,
  total_mileage_current2 numeric,
  status smallint DEFAULT 0,
  create_datetime timestamp without time zone DEFAULT now(),
  issamedata smallint DEFAULT 0,
  expenses_supplier_code character varying(255),
  sale_doc_no character varying(255),
  fuel_doc_no text,
  expenses_doc_no character varying(255),
  approve_code character varying(255),
  approve_date date DEFAULT now(),
  approve_time character varying(255),
  presling numeric DEFAULT 0,
  presling_price numeric DEFAULT 0,
  CONSTRAINT ts_documents_pk PRIMARY KEY (doc_no)
);

CREATE TABLE ts_expenses
(
  roworder serial,
  doc_no character varying(255) NOT NULL,
  item_code character varying(255),
  item_name character varying(255),
  amount numeric,
  create_datetime timestamp without time zone DEFAULT now(),
  trans_flag smallint DEFAULT 0,
  unit_standard character varying(255),
  CONSTRAINT ts_expenses_pk PRIMARY KEY (roworder)
);

CREATE TABLE ts_fuel_details
(
  roworder serial,
  doc_no character varying(255) NOT NULL,
  item_code character varying(255),
  item_name character varying(255),
  amount numeric,
  unit_price numeric,
  create_datetime timestamp without time zone DEFAULT now(),
  trans_flag smallint DEFAULT 0,
  unit_standard character varying(255),
  fuel_date date DEFAULT now(),
  supplier_code character varying(255),
  fuel_doc_no character varying(255),
  route_code character varying(255),
  CONSTRAINT ts_fuel_detailss_pk PRIMARY KEY (roworder)
);


CREATE TABLE ts_permission
(
  roworder serial,
  user_code character varying(255) NOT NULL,
  doc_list smallint NOT NULL DEFAULT 0,
  doc_approve_list smallint NOT NULL DEFAULT 0,
  doc_history_list smallint NOT NULL DEFAULT 0,
  doc_report_list smallint NOT NULL DEFAULT 0,
  doc_car_list smallint NOT NULL DEFAULT 0,
  doc_route_list smallint NOT NULL DEFAULT 0,
  create_datetime timestamp without time zone DEFAULT timezone('asia/bangkok'::text, now()),
  CONSTRAINT ts_permission_pkey PRIMARY KEY (user_code)
);

CREATE TABLE ts_route
(
  roworder serial,
  code character varying(255) NOT NULL,
  to_place character varying(255),
  from_place character varying(255),
  create_datetime timestamp without time zone DEFAULT now(),
  CONSTRAINT ts_route_pk PRIMARY KEY (code)
);

CREATE TABLE ts_transport_items
(
  roworder serial,
  doc_no character varying(255) NOT NULL,
  send_date date,
  calculation_type character varying(255),
  unit_price numeric,
  allowance numeric,
  revenue numeric,
  item_code character varying(255),
  customer character varying(255),
  route character varying(255),
  dest_name character varying(255),
  shipment_no character varying(255),
  create_datetime timestamp without time zone DEFAULT now(),
  trans_flag smallint DEFAULT 0,
  item_name character varying(255),
  CONSTRAINT ts_transport_items_pk PRIMARY KEY (roworder)
);

CREATE TABLE public.ts_reserve_doc
(
  roworder serial,
  doc_no character varying(255) NOT NULL,
  doc_date date,
  creator_code character varying(255),
  remark text,
  car_pack_type character varying(255),
  receive_date date,
  arrival_date date,
  request_receive_date date,
  request_arrival_date date,
  pickup_place character varying(255),
  dropoff_place character varying(255),
  car_code character varying(255),
  driver_code character varying(255),
  weight character varying(255),
  is_close smallint DEFAULT 0,
  status smallint DEFAULT 0,
  create_datetime timestamp without time zone DEFAULT now(),
  receive_remark character varying(255),
  receive_date_time timestamp without time zone DEFAULT now(),
  receive_user_code character varying(255),
  send_remark character varying(255),
  send_approve_user character varying(255),
  send_date_time timestamp without time zone DEFAULT now(),
  cancel_remark character varying(255),
  cancel_date_time timestamp without time zone DEFAULT now(),
  cancel_user character varying(255),
  success_date_time timestamp without time zone DEFAULT now(),
  success_date date DEFAULT now(),
  success_user character varying(255),
  CONSTRAINT ts_reserve_doc_pk PRIMARY KEY (doc_no)
)


ALTER TABLE public.ts_car ADD COLUMN car_type_2 character varying(255);
ALTER TABLE public.ts_car ADD COLUMN driver character varying(255);
ALTER TABLE public.ts_car ADD COLUMN weight character varying(255);
ALTER TABLE public.ts_car ADD COLUMN status smallint;
ALTER TABLE public.ts_car ALTER COLUMN status SET DEFAULT 0;

ALTER TABLE public.ts_permission ADD COLUMN doc_reserve_list smallint;
ALTER TABLE public.ts_permission ALTER COLUMN doc_reserve_list SET DEFAULT 0;


ALTER TABLE public.ts_permission ADD COLUMN doc_reserve_history_list smallint;
ALTER TABLE public.ts_permission ALTER COLUMN doc_reserve_history_list SET DEFAULT 0;

ALTER TABLE public.ts_permission ADD COLUMN doc_reserve_approve_list smallint;
ALTER TABLE public.ts_permission ALTER COLUMN doc_reserve_approve_list SET DEFAULT 0;


ALTER TABLE public.ts_car ADD COLUMN status smallint;
ALTER TABLE public.ts_car ALTER COLUMN status SET DEFAULT 0;
ALTER TABLE public.ts_car ADD COLUMN weight character varying(255);
ALTER TABLE public.ts_car ADD COLUMN driver character varying(255);
ALTER TABLE public.ts_car ADD COLUMN car_type_2 character varying(255);
ALTER TABLE public.ts_car ALTER COLUMN car_type_2 SET DEFAULT 0;