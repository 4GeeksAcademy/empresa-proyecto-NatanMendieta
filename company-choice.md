# TrackFlow

Escogí a la empresa TrackFlow porque me atrae la idea de manejar la logística de una empresa, la medición del rendmiento en datos, el desafio de unir dos "stacks" distintos y sobre todo, la idea de crear sistemas que funcionen 24/7.

Actualmente trabajo en un área relacionada con operaciones y mantenimiento, donde muchas tareas todavía se realizan “a mano”, utilizando papel y Excel. Por eso, este proyecto me resulta especialmente interesante, ya que me permitirá explorar una nueva forma de abordar problemas y desafíos que también existen en situaciones de la vida real.
La logística y el seguimiento de rendimiento de las operaciones relacionadas a ellas son cosas que me llamaron la atención últimamente.

## Departamentos del proyecto que me interesan
* **Operaciones de Almacén:** Para desarrollar una solución que permita centralizar la información de inventario y visualizarla en tiempo real.
* **Gestión de Transportistas:** Para analizar el rendimiento de los transportistas y automatizar parte del proceso de seguimiento y selección.
* **Tecnología:** Para trabajar en la integración de los diferentes sistemas y automatizar tareas que actualmente se realizan manualmente.

## Automatización del "Milestone Map" de interés
Me interesan estos departamentos, sobre las demás, en cuanto al uso de automatización para sustituir operaciones manuales:
* **Operaciones de almacén:** Necesitan una API de inventario unificada que devuelva el stock en tiempo real de cualquier SKU en cualquiera de los dos almacenes, un pipeline de ingesta de pedidos que parsee los emails automáticamente, un dashboard de operaciones de almacén, y alertas de stock bajo que notifiquen al cliente y al equipo de compras.
* **Gestión de transportistas:** Necesitan un motor de selección de transportista que recomiende la opción óptima dado el destino, peso y urgencia; un endpoint unificado de tracking que agregue el estado desde cualquier transportista; un portal de seguimiento público para el destinatario; y un dashboard de rendimiento de transportistas.
* **Logística inversa Responsable:** Necesitan un motor de aprobación automática de devoluciones con reglas configurables por cliente, un flujo automatizado de recogida (aprobación → etiqueta → instrucciones al cliente → programación con transportista), un sistema de inspección asistido por IA donde el operario fotografía el producto y la IA clasifica su estado, y un dashboard de devoluciones con análisis de patrones.
* **Tecnología CTO**: Necesitan telemetría y logging centralizados de ambos países, un pipeline de datos que alimente todos los dashboards de la empresa, monitorización en tiempo real con alertas automáticas, un agente de documentación técnica, y automatización de tareas de operaciones (backups, health checks, notificaciones de incidencias con contexto).
* **Dirección Ejecutiva CEO:** Necesitn un dashboard ejecutivo global con KPIs de ambas operaciones en tiempo real (volumen de envíos, tasa de entrega a tiempo, coste operativo, devoluciones, satisfacción del cliente), un informe semanal generado automáticamente los lunes a las 7 de la mañana, comparativas por país, alertas por umbrales, y un asistente de IA al que pueda consultar en lenguaje natural.

## Mi idea de Agente de IA
Mi propuesta es la de realizar un agente de IA capas de realizar el monitoreo y optimización de las operaciones logísticas. Además, deberá de analizar información del inventario, de los pedidos y envios para detectar problemas (actuales y posibles futuros) y realizar sus correspondientes alertas y acciones que la solucionen.
### Información necesaria para el agente:
 Datos de inventario de los diferentes almacenes.
** Historial de pedidos y envíos.
** Estado actual de los envíos.
** Datos históricos de rendimiento de los transportistas.
### Qué produciría o desencadenaría:
* **En Operaciones:** Generará alertas sobre niveles bajos de inventario y posibles problemas operativos.
* **En Transporte:** Generará informes sobre las rutas más óptimas según el producto.
* **En Logística:** Analizará el rendimiento de los transportistas y recomendará la opción más conveniente para cada envío.
* **En Tecnología:** Recopilar, analizar y mostrar los resultados en un "dashboard" que permita monitorear la empresa.
* **En Dirección:** Mostrará los resultados más importantes de la empresa y filtrados en un "dashboard" que permita tener un panorama general de todas las áreas de la empresa.
