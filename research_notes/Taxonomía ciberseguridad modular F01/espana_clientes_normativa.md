# Contexto España/UE para un servicio remoto y modular de ciberseguridad para pymes (automatizaciones n8n, CRM, ERP, SaaS, APIs, agentes IA), a finales de 2026

Fecha de acceso de todas las fuentes: 2026-11-05. Etiquetas de confianza: [VERIFICADO] = dato tomado de fuente primaria u oficial; [ESTIMACIÓN] = cifra o lectura de fuente secundaria fiable; [HIPÓTESIS] = inferencia propia; [NO VERIFICADO] = no se pudo confirmar.

## (a) Segmentos de cliente y pruebas de la necesidad (INCIBE, INE, madurez de las pymes)

### Takeaway
INCIBE-CERT gestionó 122.223 incidentes en 2025 (un 26 % más que en 2024). La mayoría son de malware y fraude/phishing, justo los vectores que afectan a pymes con correo, SaaS y credenciales expuestas. El INE muestra que la IA ya está muy extendida en las empresas: 33,6 % de las de 10 o más empleados y 21,4 % de las de menos de 10. No encontré ningún dato público y fiable de gasto en ciberseguridad por pyme en España.

### Cited Findings
- INCIBE-CERT gestionó **122.223 incidentes en 2025, +26 % frente a 2024**, y notificó **237.028 sistemas vulnerables**. Atiende a ciudadanía, empresas, proveedores de servicios digitales y operadores esenciales/importantes privados. Nota de prensa del 09/02/2026. [VERIFICADO] — [INCIBE, 09/02/2026](https://www.incibe.es/incibe/sala-de-prensa/incibe-detecto-mas-de-122000-incidentes-de-ciberseguridad-en-2025)
- Desglose 2025: **malware 55.411** casos, de ellos **392 ransomware**. **Fraude online 45.445** (4 de cada 10 incidentes, +19 %), del que **phishing 25.133**. **Robo de información 3.849**. El 85 % de los bots detectados son dispositivos IoT. [VERIFICADO] — misma fuente
- Operadores esenciales/importantes (alineados con NIS2): **401 incidentes**. Por sectores: banca 34 %, transporte 14 %, energía 8 %, infraestructuras de mercados financieros 7 %, seguros/pensiones 6 %. [VERIFICADO] — misma fuente
- La Línea 017 atendió **142.767 consultas en 2025 (+44,9 %)**: 49 % preventivas y 51 % reactivas. Un 28 % fueron por phishing, vishing o smishing y un 14 % por suplantación de identidad. [VERIFICADO] — misma fuente. PDF completo: [Balance de Ciberseguridad 2025](https://www.incibe.es/sites/default/files/2026-02/Balance%20de%20ciberseguridad%202025%20INCIBE/BalanceCiberseguridad2025_INCIBE.pdf) (feb. 2026)
- INCIBE no publica en la nota un desglose de incidentes "por pyme" frente a ciudadanía. [VERIFICADO: ausencia en la nota]
- INE, Encuesta TIC en empresas 2025–2026 (1T 2026): usan IA el **33,60 %** de las empresas con 10 o más empleados y el **21,36 %** de las de menos de 10. Tienen web el 82,92 % y el 36,15 %. Venden por comercio electrónico el 28,97 % y el 11,81 %. [VERIFICADO] — [INE, últimos datos](https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=estadistica_C&cid=1254736176743&menu=ultiDatos&idp=1254735576799); [nota de prensa INE](https://www.ine.es/dyngs/Prensa/ETICCE20251T2026.htm) (2026, fecha exacta no comprobada)
- Comparación: en el 1T 2025 la IA la usaba el 21,1 % de las empresas de 10 o más empleados y el cloud el 44,3 %. [ESTIMACIÓN, agregador] — [publicnow/INE](https://www.publicnow.com/view/2D325657E3B80867D1D3B4FEB6DFD2AB5AB3F08C)
- ENISA (Threat Landscape 2025, según Cinco Días): la ingeniería social es la principal vía de acceso y el phishing representa en torno al 60 % de los casos observados. [ESTIMACIÓN, cita secundaria] — [Cinco Días, 16/10/2026](https://cincodias.elpais.com/legal/2026-10-16/nis2-en-2026-la-resiliencia-digital-de-las-empresas-bajo-el-ojo-critico-del-legislador.html)
- Según A3Sec, el CCN-CERT estima cerca de 2.000 ataques semanales contra el sector público. [NO VERIFICADO en fuente primaria] — [A3Sec, 01/07/2026](https://a3sec.com/blog/nis2-en-espana-)

### Inferences
- [HIPÓTESIS] El dato de adopción de IA del INE (pasa de 21,1 % a 33,6 % en un año en empresas de 10 o más empleados) apunta a una superficie nueva y poco gobernada: agentes, conexiones a LLM y tokens de API en automatizaciones. Esto respalda un módulo de "seguridad de automatizaciones e IA".
- [HIPÓTESIS] Segmentos prioritarios:
  - (1) Pymes de 10 a 249 empleados con stack SaaS/CRM/ERP y automatizaciones. Fraude, phishing y robo de credenciales son su riesgo dominante.
  - (2) Pymes de 50 o más empleados en sectores NIS2 (Anexos I/II), que quedarán obligadas directamente.
  - (3) Pymes proveedoras de entidades NIS2 o del sector público (ENS), obligadas por cláusulas contractuales.
  - (4) Microempresas, con menor prioridad: compran poco y usan IA en menor proporción (21 %).
- [HIPÓTESIS] El fraude por suplantación (BEC, falsas facturas) es el vector más directo contra flujos de facturación y ERP automatizados.

### Gaps
- No encontré la encuesta del INE con indicadores específicos de seguridad TIC 2025 (medidas de seguridad, incidentes sufridos). Existe un módulo de seguridad en ediciones anteriores, pero no lo comprobé.
- No encontré datos públicos fiables de ONTSI ni de ENISA sobre gasto en ciberseguridad por pyme en España. Las cifras de "coste medio de un incidente para una pyme" que circulan en prensa no tienen fuente primaria comprobada.
- El Balance 2025 no separa los incidentes por tamaño de empresa en la nota de prensa. El PDF puede tener más detalle (no lo revisé entero).

## (b) Marco normativo y sus límites (NIS2/Ley de Coordinación y Gobernanza, ENS, RGPD/LOPDGDD, AI Act, CRA, DORA)

### Takeaway
A noviembre de 2026, **España sigue sin transponer NIS2**. La Ley de Coordinación y Gobernanza de la Ciberseguridad no está publicada en el BOE. La Comisión llevó a España ante el TJUE el 8/7/2026. Según Demócrata (21/09/2026), el texto ni siquiera se había aprobado en segunda vuelta ni había entrado en el Congreso. El estado posterior a esa fecha no está confirmado.

### Cited Findings
**NIS2 en España**
- Plazo de transposición: 17/10/2024 (incumplido). La Comisión abrió procedimiento de infracción en noviembre de 2024. El 8/7/2026 llevó a España ante el TJUE por no notificar la transposición completa. [ESTIMACIÓN, sitio especializado no oficial] — [nis-2-directive.com, act. 06/08/2026](https://www.nis-2-directive.com/Transposition/Spain.html)
- A3Sec describe la secuencia así: dictamen motivado el 7/5/2025, segundo requerimiento el 19/5/2026 (INFR(2024)0270) y evaluación por la Comisión en septiembre de 2026. [ESTIMACIÓN; contradice en parte la fecha de remisión al TJUE de la fuente anterior] — [A3Sec, 01/07/2026](https://a3sec.com/blog/nis2-en-espana-)
- El anteproyecto de Ley de Coordinación y Gobernanza de la Ciberseguridad se aprobó en primera vuelta en el Consejo de Ministros el **14/01/2025**. [VERIFICADO] — [DSN](https://www.dsn.gob.es/en/node/24160); [texto del anteproyecto, Interior](https://www.interior.gob.es/opencms/pdf/servicios-al-ciudadano/participacion-ciudadana/Participacion-publica-en-proyectos-normativos/Audiencia-e-informacion-publica/01_2025_Anteproyecto_ley_coordinacion_gobernanza_ciberseguridad.pdf)
- **Estado más reciente localizado:** el 21/09/2026 la Comisión General de Secretarios de Estado y Subsecretarios ya había examinado el texto y se esperaba su envío "esta semana" al Congreso. Hasta entonces seguía siendo anteproyecto, sin segunda vuelta ni registro en las Cortes. [ESTIMACIÓN, medio parlamentario especializado] — [Demócrata, 21/09/2026](https://www.democrata.es/politicas/ley-ciberseguridad-aprobacion-en-consejo-ministros/); [Demócrata, 22/09/2026](https://www.democrata.es/politicas/gobierno-se-pone-pilas-con-ciberseguridad-ley-llega-consejo-mientras-sanchez-prepara-su-escudo-ia/)
- **Conflicto entre fuentes:** A3Sec (01/07/2026) afirma que la ley "sigue en el Congreso". Demócrata (09/2026) dice que no había entrado. Doy más peso a Demócrata, que es especialista en tramitación parlamentaria. **Situación después del 22/09/2026: NO VERIFICADA.** Hay que comprobarlo en congreso.es o lamoncloa.gob.es (referencias del Consejo de Ministros).
- El Real Decreto-ley 7/2025 (sistema eléctrico) transpone NIS2 de forma parcial, según A3Sec. [NO VERIFICADO en BOE] — [A3Sec](https://a3sec.com/blog/nis2-en-espana-)
- Mientras tanto sigue vigente el marco NIS1: RDL 12/2018 y su desarrollo. [ESTIMACIÓN] — [nis-2-directive.com](https://www.nis-2-directive.com/Transposition/Spain.html)
- **Ámbito del anteproyecto:**
  - Sectores de los Anexos I y II (energía, transporte, banca, salud, agua, infraestructura digital, administración pública, espacio, postal, residuos, alimentación, fabricación, química, investigación, proveedores digitales…).
  - Regla general: **50 o más empleados o más de 10 M€** de volumen de negocio.
  - Micro y pequeñas empresas excluidas salvo que sean críticas o proveedoras únicas.
  - Crea el **Centro Nacional de Ciberseguridad**, que aún no existe.
  - [ESTIMACIÓN] — [Demócrata](https://www.democrata.es/politicas/ley-ciberseguridad-aprobacion-en-consejo-ministros/); [A3Sec](https://a3sec.com/blog/nis2-en-espana-)
- **Sanciones del anteproyecto:** leves de 10.000 a 100.000 €; graves de 100.001 a 500.000 €; muy graves de 500.001 a 2 M€; para entidades esenciales, hasta 10 M€ o el 2 % de la facturación mundial. La Directiva fija para entidades importantes hasta 7 M€ o el 1,4 %. [ESTIMACIÓN] — mismas fuentes
- **Obligaciones de fondo de la Directiva** (estables desde 2022):
  - Medidas del art. 21: análisis de riesgos, gestión de incidentes, continuidad y copias, **seguridad de la cadena de suministro**, cifrado, control de accesos y MFA.
  - Notificación del art. 23: **24 h** alerta temprana, **72 h** notificación e informe final en **1 mes**.
  - Responsabilidad y formación de la dirección (art. 20).
  - [VERIFICADO a través de la Directiva 2022/2555 citada; no leí EUR-Lex directamente] — [A3Sec](https://a3sec.com/blog/nis2-en-espana-); [EUR-Lex 2022/2555](https://eur-lex.europa.eu/eli/dir/2022/2555/oj)

**Implicaciones para proveedores y MSSP**
- NIS2 obliga a las entidades a controlar a sus terceros críticos, "proveedores gestionados" y cloud. Esto ya se nota en pliegos, SLA y exigencias de auditoría, aunque no haya ley nacional. [ESTIMACIÓN] — [Cinco Días, 16/10/2026](https://cincodias.elpais.com/legal/2026-10-16/nis2-en-2026-la-resiliencia-digital-de-las-empresas-bajo-el-ojo-critico-del-legislador.html); [A3Sec](https://a3sec.com/blog/nis2-en-espana-)
- En la Directiva, los "proveedores de servicios de seguridad gestionados" son entidad del Anexo I (gestión de servicios TIC B2B). Como pyme pequeña probablemente quedarían fuera por tamaño, pero podrían caer dentro de un régimen de proveedor. [HIPÓTESIS; comprobar el Anexo I en EUR-Lex]

**ENS**
- El Real Decreto 311/2022 (ENS) sigue siendo la referencia para el sector público y sus proveedores tecnológicos. [ESTIMACIÓN] — [A3Sec](https://a3sec.com/blog/nis2-en-espana-); [BOE RD 311/2022](https://www.boe.es/eli/es/rd/2022/05/03/311)
- Kit Consulting toma el ENS (categoría media-alta) e ISO 27001 como referencia del SGSI. [VERIFICADO] — [Plan de Recuperación](https://planderecuperacion.gob.es/noticias/conoce-programa-kit-consulting-servicios-asesoramiento-digital-prtr)

**AI Act**
- Las obligaciones de transparencia del art. 50 se aplican desde el **2/8/2026**.
- Con el **Digital Omnibus**, las obligaciones de alto riesgo del Anexo III pasan del 2/8/2026 al **2/12/2027**. Las de productos del Anexo I se retrasan a 2028.
- Calendario del Omnibus: acuerdo político a principios de mayo de 2026, Parlamento Europeo el 16/06/2026, Consejo el 29/06/2026. La publicación en el DOUE estaba pendiente.
- [ESTIMACIÓN, bufete y consultora] — [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/); [NordFlux](https://nordflux.de/es/conocimiento/eu-ai-act-a-partir-del-2-de-agosto-de-2026-lo-que-realmente-aplica-para-una-empresa-de-20-personas-actualizacion); [Comisión Europea](https://digital-strategy.ec.europa.eu/es/policies/regulatory-framework-ai)
- Ya están en vigor las prácticas prohibidas y la alfabetización en IA (art. 4, desde el 2/2/2025) y las obligaciones de modelos GPAI (desde el 2/8/2025). [ESTIMACIÓN, por conocimiento previo; no comprobado en esta sesión]

**CRA (Reglamento 2024/2847)**
- En vigor desde el 10/12/2024. Se aplica a productos con elementos digitales, no a servicios. Las obligaciones principales se aplican desde finales de 2027 (11/12/2027). Las de notificación de vulnerabilidades, desde el 11/09/2026. [ESTIMACIÓN; la fecha de septiembre de 2026 sale de conocimiento previo, NO VERIFICADO en esta sesión] — [A3Sec](https://a3sec.com/blog/nis2-en-espana-)

**DORA**
- DORA es lex specialis frente a NIS2 en el riesgo TIC del sector financiero. Solo importa si el cliente es una entidad financiera o un proveedor TIC de una. [ESTIMACIÓN] — [A3Sec](https://a3sec.com/blog/nis2-en-espana-)

**RGPD/LOPDGDD**
- No busqué fuentes en esta sesión. Por conocimiento general [NO VERIFICADO aquí], las automatizaciones afectan a:
  - art. 28 (contrato de encargado con n8n cloud, CRM y SaaS);
  - art. 32 (seguridad);
  - arts. 33-34 (brecha: 72 h a la AEPD);
  - art. 22 (decisiones automatizadas);
  - arts. 44 y siguientes (transferencias internacionales a proveedores de LLM o SaaS de EE. UU.).

### Inferences
- [HIPÓTESIS] Para el posicionamiento comercial, NIS2 no se puede vender como obligación legal española vigente para pymes a finales de 2026. Sí es defendible venderla como "preparación" y como exigencia contractual en la cadena de suministro. Para la mayoría de las pymes, RGPD y el fraude son los motores inmediatos.
- [HIPÓTESIS] El AI Act tiene poco peso obligatorio para las pymes usuarias (deployers) hasta diciembre de 2027, salvo transparencia (art. 50) y alfabetización en IA (art. 4).

### Gaps
- No pude confirmar si el Consejo de Ministros aprobó el proyecto de ley y lo remitió al Congreso entre finales de septiembre y noviembre de 2026. Hay que consultar el BOCG o las referencias del Consejo de Ministros.
- No comprobé la publicación del Digital Omnibus en el DOUE.
- No leí EUR-Lex ni el BOE directamente para el CRA, el ENS o el RDL 7/2025.

## (c) Programas de ayuda y criterios para comparar ofertas

### Takeaway
**Kit Digital y Kit Consulting están cerrados a nuevas solicitudes**: Kit Digital desde el 31/10/2025 (convocatorias III y IV) y Kit Consulting desde el 31/03/2025. No hay convocatoria nueva publicada a fecha de las fuentes. Como criterios de comparación públicos, ENISA ofrece la guía de 12 pasos para pymes y prepara un esquema de certificación de MSS, centrado de momento en la respuesta a incidentes.

### Cited Findings
- **Kit Digital (Red.es):**
  - 5 convocatorias. Segmentos: I (10 a <50 empleados), II (3 a <10), III (0 a <3), IV (50 a <100), V (100 a <250).
  - Cierres: convocatorias I y II el 31/12/2024; V el 30/06/2025; III y IV el **31/10/2025**.
  - En la página no aparece ninguna convocatoria futura (datos actualizados a 26/10/2026).
  - La categoría "Puesto de Trabajo Seguro" se añadió el 12/06/2024.
  - [VERIFICADO] — [kitdigital.red.es/convocatorias](https://www.kitdigital.red.es/convocatorias)
- Importes generales de Kit Digital: hasta 12.000 € (segmento I) y 6.000 € (II). La Moncloa cita de 3.000 € a 29.000 € según el tamaño. [VERIFICADO, fuentes oficiales] — [España Digital](http://espanadigital.gob.es/lineas-de-actuacion/programa-kit-digital); [La Moncloa, 28/02/2023](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/asuntos-economicos/paginas/2023/280223-como-solicitar-kit-digital.aspx). El importe concreto de la categoría Ciberseguridad por segmento **no lo verifiqué** en fuente oficial.
- **Kit Consulting:**
  - Ofrece asesoramiento en Ciberseguridad en tres niveles: Básico (plan y adaptación del SGSI a ISO 27001/ENS media-alta), Avanzado y Preparación para la Certificación. Para el avanzado hay que haber completado antes el básico. [VERIFICADO] — [Plan de Recuperación](https://planderecuperacion.gob.es/noticias/conoce-programa-kit-consulting-servicios-asesoramiento-digital-prtr); [Red.es](https://www.red.es/es/iniciativas/proyectos/kit-consulting)
  - Ayuda máxima de 6.000 € para Ciberseguridad Avanzado. [ESTIMACIÓN, agente comercial] — [L3G](https://l3gmarketing.com/kit-consulting/)
  - Bono de hasta 24.000 € para empresas de 100 a <250 empleados. [ESTIMACIÓN] — [AECIM](https://acelerapyme-aecim.com/kit-consulting-amplia-la-ayuda-para-pymes-de-10-a-49-empleados-y-flexibiliza-los-plazos-de-formalizacion/)
  - Las solicitudes cerraron el **31/03/2025**. A junio de 2026 no había convocatoria nueva. La Orden TDF/38/2026 permitiría reinvertir remanentes. [ESTIMACIÓN, blog; la Orden no la comprobé en el BOE] — [Ortega Castro, 17/06/2026](https://angelortegacastro.com/kit-consulting-2026-reapertura/)
- **ENISA, criterios y certificación de MSS:**
  - La guía para pymes de 12 pasos sirve como checklist mínimo: cultura y responsabilidad de la dirección, protección de datos, cloud, terceros, etc. [VERIFICADO] — [ENISA](https://www.enisa.europa.eu/publications/cybersecurity-guide-for-smes)
  - La modificación del Cybersecurity Act sobre MSS entró en vigor en febrero de 2025. Abre la puerta a un esquema europeo de certificación de MSS cuyo primer ámbito es el ciclo de gestión de incidentes (perfil de respuesta a incidentes; detección y recuperación vendrán después). Consulta pública del borrador lanzada el 24/07/2026. [VERIFICADO, ENISA, noticia del 25/06/2025 actualizada] — [ENISA](https://www.enisa.europa.eu/news/eu-managed-security-services-certification-to-drive-the-cybersecurity-market)
  - ENISA tiene un informe de análisis del mercado de MSS y un "SME Cyber Resilience Maturity Assessment Model". [VERIFICADO: existen] — [ENISA MSS market analysis](https://www.enisa.europa.eu/publications/managed-security-services-market-analysis); [ENISA publications](https://www.enisa.europa.eu/publications)
- **Criterios que se derivan de las obligaciones NIS2 y que un comprador exigirá:**
  - capacidad de notificación en 24/72 h;
  - gestión de cadena de suministro;
  - MFA y control de accesos;
  - continuidad y copias;
  - formación de la dirección;
  - auditorías y cláusulas contractuales.
  - [ESTIMACIÓN] — [A3Sec](https://a3sec.com/blog/nis2-en-espana-); [Cinco Días](https://cincodias.elpais.com/legal/2026-10-16/nis2-en-2026-la-resiliencia-digital-de-las-empresas-bajo-el-ojo-critico-del-legislador.html)

### Inferences
- [HIPÓTESIS] Propuesta de matriz de comparación de ofertas:
  - (1) alcance de la monitorización (endpoints, identidad/M365/Google, SaaS, APIs y automatizaciones);
  - (2) tiempos de detección y respuesta en el SLA (MTTD/MTTR, 24x7 o no);
  - (3) soporte a la notificación de 24/72 h (NIS2) y de 72 h a la AEPD (RGPD);
  - (4) certificaciones (ENS, ISO 27001 y el futuro esquema EU MSS);
  - (5) residencia de datos y subencargados;
  - (6) modularidad y precio por módulo;
  - (7) informes para la dirección;
  - (8) evaluación de proveedores terceros;
  - (9) cobertura de IA y agentes (inventario, gestión de secretos, prompt injection).
- [HIPÓTESIS] Sin subvenciones abiertas, la oferta no puede depender de Kit Digital. Los agentes digitalizadores acreditados son posibles canales o competidores.

### Gaps
- No encontré criterios públicos de Gartner o Forrester (Magic Quadrant o Market Guide de MDR/MSS). Están tras muro de pago.
- No verifiqué en fuente oficial los importes de la categoría Ciberseguridad de Kit Digital por segmento.
- No comprobé si hay nuevas ayudas autonómicas o de INCIBE para pymes en 2026.
