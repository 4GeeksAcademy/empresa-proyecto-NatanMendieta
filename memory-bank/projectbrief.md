# Project Brief: TrackFlow

Este documento resume únicamente el briefing de empresa de [`CONTEXT.md`](../CONTEXT.md). Las referencias entre paréntesis nombran las secciones fuente de ese archivo.

## Empresa

TrackFlow es una empresa de logística de última milla y gestión de almacenes fundada en 2009 en Los Ángeles, Estados Unidos. Opera en Estados Unidos y España, con almacenes en Los Ángeles y Zaragoza; el briefing indica aproximadamente 130 empleados e ingresos anuales de unos 9 millones de euros. (Fuente: `CONTEXT.md`, “AI Engineering · 4Geeks Academy — Company Briefing”)

TrackFlow almacena inventario de marcas de comercio electrónico, prepara y envía sus pedidos mediante transportistas y gestiona las devoluciones. La operación logística completa, desde el pedido hasta la entrega o devolución, queda a cargo de TrackFlow. (Fuente: `CONTEXT.md`, “AI Engineering · 4Geeks Academy — Company Briefing”)

El briefing identifica a Thomas Harry como fundador y CEO en “How the company is organised”, y a Daniel Espinoza como CEO en “Executive Direction”. La discrepancia queda sin resolver. (Fuente: `CONTEXT.md`, “How the company is organised”; “The Departments and Their Problems” > “Executive Direction”)

## Usuarios

- **Clientes de marca (B2B):** contratan la operación logística y consultan el rendimiento de sus operaciones. (Fuente: `CONTEXT.md`, “How the company is organised” > “Customer Experience”)
- **Consumidores finales (B2C):** reciben los paquetes y consultan su seguimiento. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Customer Experience”)
- **Equipos internos:** operarios y responsables de almacén; coordinadores de transporte; equipo de devoluciones; agentes de Customer Experience; gestores de cuentas y desarrollo comercial; tecnología; y dirección ejecutiva. (Fuente: `CONTEXT.md`, “How the company is organised”; “The Departments and Their Problems”)

## Problema

La empresa carece de infraestructura integrada para escalar una operación entre dos países. Los almacenes no comparten visibilidad de inventario; los datos de rendimiento de transportistas no están estructurados; las devoluciones y consultas de clientes se revisan manualmente; y los informes ejecutivos se preparan a mano con datos atrasados. La tecnología incluye dos sistemas de gestión de almacén, un ERP antiguo e integraciones poco documentadas; las incidencias se comunican informalmente. (Fuente: `CONTEXT.md`, “Where the company stands today”; “The Departments and Their Problems” > “Technology” y “Executive Direction”)

Como consecuencia, TrackFlow es más lenta, comete más errores y es menos rentable de lo que necesita ser; el briefing señala que la brecha aumenta mientras sus competidores invierten en automatización. (Fuente: `CONTEXT.md`, “Where the company stands today”)

## Propuesta de valor

TrackFlow resuelve para las marcas la operación logística desde el almacenamiento del inventario hasta la preparación, envío, entrega y gestión de devoluciones. El mandato de TrackFlow Tech es construir los sistemas, integraciones y automatizaciones inteligentes que permitan operar como una empresa logística moderna. (Fuente: `CONTEXT.md`, “AI Engineering · 4Geeks Academy — Company Briefing”; “Where the company stands today”)

## Objetivos descritos

El objetivo empresarial expresado es dotar a TrackFlow de infraestructura para operar a escala en dos países y mejorar la velocidad, fiabilidad y rentabilidad de sus operaciones. (Fuente: `CONTEXT.md`, “Where the company stands today”)

El briefing enumera estas necesidades por área, sin asignarles una prioridad o fase:

- **Almacenes:** API de inventario unificado, ingestión automatizada de pedidos por correo, dashboard operativo y alertas de bajo inventario. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Warehouse Operations”)
- **Última milla:** recomendación de transportista, endpoint de seguimiento unificado, portal público de seguimiento y dashboard de rendimiento. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Last Mile and Carrier Management”)
- **Devoluciones:** aprobación configurable, recogida automatizada, inspección asistida por IA y análisis de patrones. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Reverse Logistics”)
- **Customer Experience:** resolución automática de consultas de seguimiento y devoluciones, base de conocimiento semántica, ticketing unificado, dashboard y análisis de sentimiento. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Customer Experience”)
- **Relaciones comerciales:** integración CRM, informes automatizados para clientes, dashboard de salud y alertas de renovación, y asistencia comercial. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Commercial and Client Relations”)
- **Tecnología:** telemetría y logging centralizados, pipeline de datos para dashboards, monitorización y alertas, agente de documentación técnica y automatización de tareas operativas. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Technology”)
- **Dirección:** dashboard ejecutivo con KPIs, informe semanal automatizado, comparación por país, alertas por umbral y asistente en lenguaje natural. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Executive Direction”)

## Alcance del hito

`CONTEXT.md` describe el contexto de toda la empresa y necesidades para varios departamentos, pero no identifica qué hito está activo, qué entregables pertenecen a ese hito, ni sus criterios de aceptación o fechas. Por tanto, el alcance específico del hito queda **sin especificar**; la lista anterior refleja necesidades del briefing, no una selección ni un compromiso de implementación. (Fuente: `CONTEXT.md`, “Where the company stands today”; “The Departments and Their Problems”)

## Restricciones de negocio

- La operación abarca Estados Unidos y España, con almacenes en Los Ángeles y Zaragoza. (Fuente: `CONTEXT.md`, “AI Engineering · 4Geeks Academy — Company Briefing”)
- La empresa trabaja con ocho transportistas. La asignación es actualmente manual y el seguimiento requiere consultar portales distintos. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Last Mile and Carrier Management”)
- Las devoluciones representan entre el 18 % y el 25 % del volumen, según cliente y país, y actualmente pasan por revisión humana. (Fuente: `CONTEXT.md`, “How the company is organised” > “Reverse Logistics”; “The Departments and Their Problems” > “Reverse Logistics”)
- Los clientes de Customer Experience son tanto marcas como consumidores finales; los canales actuales incluyen correo electrónico, WhatsApp y teléfono. El briefing indica que la cobertura fuera del horario laboral es nula. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Customer Experience”)
- La operación logística se describe como continua y se indica que los clientes esperan servicio después de las 18:00; las soluciones de seguimiento, CX y operaciones deben estar siempre disponibles. (Fuente: `CONTEXT.md`, “Why Choose TrackFlow?”)
- La tecnología existente incluye dos WMS diferentes, un ERP heredado, scripts Python no documentados y bases de datos en dos proveedores cloud. (Fuente: `CONTEXT.md`, “The Departments and Their Problems” > “Technology”)
- El briefing menciona dos idiomas y dos entornos regulatorios, pero no especifica idiomas base obligatorios, normativas concretas, presupuestos, SLA, requisitos de privacidad ni políticas de retención. Para Customer Experience, el soporte en español e inglés se califica como opcional, aunque altamente recomendado. (Fuente: `CONTEXT.md`, “Why Choose TrackFlow?”; “The Departments and Their Problems” > “Customer Experience”)
