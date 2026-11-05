# Informe final · Viabilidad de un servicio modular de ciberseguridad para n8n, webhooks, APIs, integraciones SaaS/ERP y agentes IA (operación remota desde España)

Fecha: 2026-11-05. Fase F12 (consolidación). Etiquetas: **[Hecho verificado]**, **[Estimación]**, **[Hipótesis]**, **[No verificado]**. Las referencias `Fxx-Syyy` remiten a `RESULTADOS/F12/FUENTES_CONSOLIDADAS.csv` (270 fuentes únicas por URL). Las decisiones `Dnn` remiten a `CONTROL/DECISIONES.md`. **Este documento no es asesoramiento jurídico ni financiero** y no afirma el cumplimiento de ninguna norma.

---

## 1. Resumen ejecutivo y veredicto

**Veredicto: VIABLE CON CONDICIONES**, y solo en una forma mucho más estrecha que la de la idea inicial.

La idea de partida era una "plataforma modular integral" con ocho capas. **Esa idea no es viable** para un operador pequeño. Casi todas las capas se cubren ya con productos commodity, gratuitos o baratos, como Cloudflare, Svix, Hookdeck, Doppler, EDR o backup (F03, F04). La seguridad de IA se está concentrando en grandes fabricantes (F03-S010, S012, S013). Además, prometer cobertura "integral" es falso desde el punto de vista técnico: la prompt injection no está resuelta (F01) y nadie controla los zero-days de n8n ni el compromiso de un integrador SaaS, como en el caso Drift (F01).

Sí es **plausible** un servicio especializado y estrecho, que se presta sobre la instancia n8n del propio cliente:
- **M1:** endurecimiento de n8n self-hosted más un SLA de parches en horario laboral.
- **M2:** un gateway de webhooks con HMAC, timestamp y deduplicación.
- **M3:** revisión de tokens e integraciones.
- **Entrada:** una auditoría express de alcance cerrado.
- **Segmentos:** se vende primero a agencias n8n, como canal, y a pymes con n8n Community en producción (F09, F11).

Cuatro evidencias sostienen esta versión:
1. **Hueco de oferta.** No se encontró ningún competidor directo verificado en España ni en la UE (F02, F03). Los únicos directos están en EE. UU., en el nicho HIPAA (F03-S024–S026).
2. **Dolor técnico documentado.**
   - CVE-2026-21858, con CVSS 10 (F01).
   - Entre 26.512 y 105.753 instancias expuestas, según la metodología (F01).
   - n8n publica una minor casi cada semana y en 2026 ha sacado boletines con varios CVE críticos a la vez (F08-S003, S004).
3. **Hueco funcional en n8n Community.** External Secrets y Log Streaming solo están disponibles en Enterprise o Cloud (F06-S003, S004).
4. **Costes bajos.** La infraestructura sale por unos 11 €/mes por cliente (F08), y la licencia de n8n permite prestar el servicio en el servidor del cliente (F07-S009).

Las condiciones son estrictas. **Ninguna está cumplida hoy:**
1. **La demanda y el precio no están validados.** No hay ninguna entrevista, ningún cliente y ningún precio aceptado. Según una señal todavía no verificada, el 46 % de las pymes gasta menos de 500 €/año en ciberseguridad (F05). Es el riesgo principal.
2. **Captación de unas 12 instalaciones el primer año sin canal verificado.** Es lo que necesita el escenario Base, que deja ≈34 k€/año de renta del operador antes de IRPF. El escenario Prudente, ≈4,9 k€/año, **no permite vivir** (F10). No se debe dejar un empleo antes del go/no-go.
3. **Sin hosting de n8n** salvo acuerdo escrito con n8n (F07, D22), y **sin 24x7** (F08, D29).
4. **Plantillas jurídicas y seguro antes del primer cliente:** contrato de encargo (art. 28 RGPD), autorización de pruebas (arts. 197 bis y 264 bis CP), limitación de responsabilidad y seguro de RC y ciber (F07, D25). El coste del seguro es desconocido.
5. **Go/no-go en la semana 16** con criterios medibles (F11 §10), entre ellos ≥3 pilotos pagados y ≥2 conversiones a cuota completa.

Lectura crítica: el estudio prueba **el hueco de oferta y el dolor técnico**, pero **no la disposición a pagar**. Un hueco de oferta también puede indicar que no hay mercado. Hasta que haya pagos reales, el negocio es una **hipótesis razonable, pero no demostrada**.

---

## 2. Metodología

- Doce fases secuenciales (F01–F12), una por sesión, según `00_PROTOCOLO.md`. Cada fase dejó RESULTADOS, FUENTES y PENDIENTES.
- Búsqueda y scraping con Firecrawl de fuentes primarias siempre que fue posible: webs de proveedores, docs de n8n, BOE, NVD, RFC y especificación MCP. Las fuentes secundarias se marcan como tales.
- F12 no hizo investigación nueva: consolidó, auditó y resolvió contradicciones con los datos existentes.
- Auditoría de fuentes:
  - 305 registros de F01–F11, que quedan en **270 URL únicas** (5 son referencias internas sin URL).
  - 18 URL aparecen en más de una fase.
  - Por tipo normalizado: **172 hecho verificado**, 53 estimación, 43 no verificado, 1 hipótesis y 1 resultado negativo.
  - Por confianza: **117 alta**, 109 media y 44 baja.
  - Detalle en `F12_RESULTADOS.md`.
- Limitaciones globales:
  - Muchas lecturas se hicieron sobre extractos o resúmenes automáticos.
  - No se hizo ninguna entrevista ni trabajo de campo.
  - No hay conversión de divisas.
  - Los textos UE (CRA, DORA, AI Act) no se releyeron en fuente primaria durante F07.

---

## 3. Síntesis por fase

| Fase | Hallazgo clave | Estado de la evidencia |
|---|---|---|
| F01 Alcance | El problema está en la capa de integración (tokens OAuth, webhooks, n8n sin parchear, agentes) y no en el perímetro web. Turnstile solo cubre formularios humanos (D02). Ocho capas (D01) | Mayoritariamente verificado (116 fuentes) |
| F02 España | No hay competidor directo estricto. Directa parcial: Binovo FutureAI (F02-S001). MSSP baratos: Vodafone desde 34 €/mes por sede, Cibersafety 5,99–9,49 €/equipo, Mencar 475–845 €/mes | Verificado en web de proveedor; la ausencia no es demostrable |
| F03 Internacional | Directos solo en EE. UU. (HIPAA). La amenaza principal es n8n Enterprise. Las capas commodity tienen free tiers. La seguridad de IA se consolida (Lakera, Prompt Security, Protect AI) | Verificado; búsqueda UE limitada |
| F04 Precios | Herramientas baratas y transparentes. Los servicios solo tienen rangos de blog: revisión básica 800–1.500 €, pentest web 3.000–8.000 €, día de consultor 450–800 € | Herramientas verificadas; servicios estimados |
| F05 Mercado | Segmento de 208.536 pymes de 10–249 empleados. SAM 24.173 / 82.163 / 132.629 empresas. SOM realista de 10 / 25 / 50 clientes a 3 años | Universo verificado; valor dependiente de un precio hipotético |
| F06 Arquitectura | Borde Cloudflare, gateway propio HMAC/MCP, n8n privado, secretos externos, SIEM-lite y backups. El valor está en el gateway y la operación | Docs verificadas; diseño hipotético |
| F07 Normativa | NIS2 sin transponer y la iniciativa decae (RD 806/2026, F07-S005). El RGPD como encargado es la obligación cierta. La licencia de n8n impide el hosting. No se encontró que haga falta autorización de seguridad privada | Mixto; requiere abogado |
| F08 Operación | VPS de ≈11 €/mes por cliente. Docker Compose con runners externos. Parches ≤72 h para críticos. SLA laboral. 20–40 clientes por operador | Precios verificados; horas estimadas |
| F09 Segmentos | Ranking: S1 agencias n8n (15), S2 n8n self-hosted (14), S3 SaaS B2B (13). No liderar con salud, NIS2 ni IA | Todas las puntuaciones son estimación |
| F10 Finanzas | Margen del año 1 con 25 €/h imputados: 585 / 26.437 / 81.798 €. Renta del operador: 4,9 / 34,3 / 93 k€ | Hipótesis ancladas |
| F11 MVP | M1–M3, auditoría express a 690–990 €, 20 entrevistas, 3–5 pilotos, go/no-go en la semana 16 | Diseño; nada medido |

---

## 4. Las ocho capas y dónde está el valor

| # | Capa | ¿Commodity? | ¿Valor para un operador pequeño? | Evidencia |
|---|---|---|---|---|
| 1 | Perímetro web (WAF, Turnstile, bots) | Sí: Cloudflare 0/20/200 USD | Bajo; solo como configuración | F04-S019–S021, F06-S001 |
| 2 | Webhooks M2M | La técnica (HMAC) es estándar; Svix y Hookdeck son productos | **Alto como operación**: gateway delante de n8n (M2) | F01, F06, F03 |
| 3 | Plataforma n8n | No para Community | **Máximo**: parcheo, hardening, runners externos (M1) | F01 CVE-2026-21858, F08-S003/S004 |
| 4 | APIs | Pentest de API desde 760 € | Medio; segunda ola (S3) | F02-S008 |
| 5 | Identidad e integraciones SaaS/ERP | SSPM enterprise caro | **Alto para pymes**: revisión de scopes y tokens (M3) | F01 (Drift, Gainsight), F06-S006 |
| 6 | Secretos y NHI | Gestores baratos (Doppler 21 USD/usuario) | Medio: secretos fuera de n8n Community | F04-S037/S038, F06-S003 |
| 7 | Agentes IA / MCP | Guardrails en consolidación | Bajo al inicio: solo contener; fase 2 | F01, F03, F06-S007/S008 |
| 8 | Datos, monitorización y recuperación | Backup y SIEM commodity | Medio: backups probados y clave de cifrado custodiada | F08 |

**El valor está en la intersección de las capas 2, 3, 5 y 6, entregada como operación continua.** No está en ninguna herramienta concreta.

---

## 5. Mapa de competencia

37 competidores únicos (deduplicados por dominio) en la hoja `Competidores`.

- **Directos:**
  - MpireSolutions, HIPAA Compliant Hosting y BD Emerson. Los tres en EE. UU., sin precio público (F03).
  - Directo parcial en España: Binovo FutureAI, partner n8n (F02).
  - Directo potencial: YAG Comunicación (blog, sin servicio).
- **Indirectos:**
  - n8n Cloud y Enterprise (amenaza y canal).
  - MSSP españoles: Vodafone, Cibersafety, Mencar, CISO.es.
  - MDR: Huntress.
  - SSPM y NHI: AppOmni, Obsidian, Astrix, Grip, Nudge.
  - API security: Wallarm, 42Crunch, Salt.
  - IA: Check Point/Lakera, SentinelOne/Prompt Security, Palo Alto/Protect AI.
- **Complementarios:** Cloudflare, Svix, Hookdeck, Doppler, Infisical, Vault, Wazuh, pentesters españoles (Binaura, PentestingTeam, CISEC) y WAF gestionado (Inforges).
- **Canal y competidor a la vez:** las agencias n8n (F02, F09). Es el riesgo "ya lo dejamos seguro nosotros".

---

## 6. Precios

71 filas en la hoja `Precios`. Moneda original, sin conversión (D49).

| Categoría | Rango | Tipo |
|---|---|---|
| Revisión básica de seguridad web para pyme (ES) | 800–1.500 € | Estimación (F04-S005) |
| Pentest web para pyme (ES) | 3.000–8.000 € | Estimación (F04-S001) |
| Pentest de API (ES) | desde 760 € | Verificado (F02-S008) |
| Consultor o pentester (ES) | 450–625 €/día (Malt); desde 800 €/día (CISEC) | Estimación / verificado |
| vCISO/MSSP (ES) | 475–845 €/mes | Verificado (F02-S002) |
| Endpoint gestionado (ES) | 5,99–9,49 €/equipo/mes | Verificado (F02-S003) |
| MDR (Huntress) | 8,99 USD/endpoint/mes | Verificado en F03; vía agregador en F04 |
| n8n Cloud | 20 / 50 / 800 USD/mes (anual); Enterprise bajo consulta | Verificado (F04-S023–S026) |
| VPS UE | 5,99–8,99 EUR/mes sin IVA (Hetzner) | Verificado (F08-S007) |
| **Oferta propuesta** | Auditoría express 690–990 €; setup 1.200–2.500 €; cuota 250–550 €/mes | **Hipótesis** (F10, F11) |

---

## 7. Mercado (TAM / SAM / SOM, F05)

| Métrica | Bajo | Base | Alto |
|---|---|---|---|
| Segmento (pymes de 10–249 empleados) | 208.536 | 208.536 | 208.536 |
| TAM (precio de 3.000 / 6.000 / 12.000 € al año) | 625,6 M€ | 1.251,2 M€ | 2.502,4 M€ |
| SAM en empresas | 24.173 (CRM × IA) | 82.163 (cloud de pago) | 132.629 (ERP) |
| SAM en valor | 72,5 M€ | 493 M€ | 1.591,5 M€ |
| SOM a 3 años | 10 clientes / 30 k€ | 25 / 150 k€ | 50 / 600 k€ |

El tamaño del mercado no es la restricción. Lo que limita son el precio aceptado y la capacidad de entrega.

El precio del escenario alto (12.000 €/año) es incoherente con F10. En F10 la cuota máxima es de 550 €/mes, unos 6.600 €/año más el setup. **El SAM en valor se considera un techo teórico, no un objetivo.**

---

## 8. Arquitectura y operación (F06, F08)

El flujo de referencia es este:
1. Borde Cloudflare: DNS, TLS, WAF y rate limit. Turnstile solo en formularios.
2. Gateway propio con Nginx o Traefik y un verificador:
   - HMAC con ventana de ±5 min, dedupe y rate limit por cliente.
   - Validación de audiencia en MCP.
3. n8n en red privada: con PostgreSQL y task runners externos, sin exponer el puerto 5678 y con la API pública desactivada.
4. Secretos fuera de n8n Community: Doppler, Infisical o variables de entorno.
5. Logs del contenedor a un SIEM-lite.
6. Backups: `pg_dump` cifrado con restic a un almacenamiento externo, y la `N8N_ENCRYPTION_KEY` custodiada aparte.
7. Infraestructura: unos 11 €/mes por cliente.
8. Horas estimadas: alta de 8–16 h y 2–4 h al mes (estimación sin medir).
9. SLA laboral, con P1 en 1 h laboral.

---

## 9. Restricciones legales y de licencias (F07)

- **Licencia de n8n (Sustainable Use License):**
  - Permitido: consultoría y gestión en el servidor del cliente.
  - Prohibido: hosting como servicio, white-label y funciones `.ee` sin licencia (F07-S008, S009).
  - Decisión D22: no ofrecer hosting.
  - Pendiente: confirmación escrita a license@n8n.io, también sobre la operación del gateway junto a la instancia.
- **RGPD:** el proveedor actúa como encargado. Necesita contrato del art. 28, medidas del art. 32, aviso de brechas "sin dilación indebida" y una base válida para transferencias a EE. UU. (DPF o cláusulas contractuales tipo; estado del DPF no verificado).
- **NIS2:** sin ley española. Las Cortes se disolvieron el 05/10/2026 (verificado) y la iniciativa decae (ISMS Forum, secundaria). Solo hay presión contractual por la cadena de suministro (art. 21.2.d).
- **Código Penal:** el pentesting exige autorización escrita y el permiso del SaaS tercero cuando sus términos lo pidan.
- **Seguridad privada (Ley 5/2014):** no se ha localizado ningún desarrollo reglamentario que obligue a autorización. Resultado negativo; requiere abogado.
- **Otras normas:** el AI Act exige alfabetización (art. 4) y transparencia (art. 50) si se despliegan agentes. El CRA solo aplicaría si se vende software propio. DORA solo con clientes financieros.

---

## 10. Ranking de segmentos (F09; puntuaciones = estimación)

| Puesto | Segmento | Prioridad F09 (máx. 20) |
|---|---|---|
| 1 | S1 Agencias/consultoras n8n (canal y cliente) | 15 |
| 2 | S2 Pymes de 10–249 empleados con n8n self-hosted Community | 14 |
| 3 | S3 SaaS B2B con webhooks/APIs | 13 |
| 4 | S4 MSP canal · S5 proveedores NIS2/ENS · S6 agentes IA/MCP · S7 n8n Cloud | 12 |
| 5 | S8 e-commerce · S9 gestorías | 11 |
| 6 | S10 salud privada | 9 |

En el Excel, la columna F vale N+P+A−S, es decir, la prioridad de F09 menos 6. El orden es el mismo (D50).

---

## 11. Escenarios financieros (F10; hoja `Finanzas`, recalculada)

| Escenario | Instalaciones | Setup | Clientes recurrentes (media) | Cuota | Ingresos | Costes | **Margen (25 €/h imputados)** | Renta del operador antes de IRPF |
|---|---|---|---|---|---|---|---|---|
| Prudente | 6 | 1.200 € | 1,8 | 250 € | 12.600 € | 12.015 € | **585 €** | ≈4,9 k€ |
| Base | 12 | 1.800 € | 4,5 | 400 € | 43.200 € | 16.763 € | **26.437 €** | ≈34,3 k€ |
| Favorable | 20 | 2.500 € | 8,2 | 550 € | 104.120 € | 22.322 € | **81.798 €** | ≈93 k€ (excede la capacidad de una persona desde el año 2) |

Los márgenes se recalcularon en Python y con LibreOffice, y coinciden con las fórmulas del Excel.

Sensibilidad del escenario Base:
- Volumen ±30 %: −10,2 / +10,5 k€.
- Precio ±20 %: −8,5 / +8,8 k€.
- Horas ±50 %: +4,0 / −3,7 k€.

Equilibrio para vivir (2.000 €/mes): unos 7–8 clientes a 400 €/mes, o unos 12 a 250 €/mes.

---

## 12. MVP y go/no-go (F11)

- **Módulos:** M1 hardening y parches, M2 gateway HMAC, M3 tokens.
- **Fuera de alcance:** 24x7, pentest intrusivo, hosting, guardrails IA propios y certificación.
- **Entrada:** auditoría express de 690–990 € + IVA, de solo lectura.
- **Laboratorio:** pruebas T1–T10, como rechazo del 100 % de firmas inválidas y replays, p95 ≤50 ms y restauración ≤2 h.
- **GO si se cumplen todos estos criterios:**
  - ≥3 pilotos pagados y ≥2 que pasen a cuota completa.
  - ≥40 % de entrevistados con gasto previo ≥1.500 €/año.
  - ≥30 % de entrevistados que cierran un compromiso concreto.
  - ≤6 h/mes de operación por cliente y onboarding ≤8 h.
  - 0 incidentes causados por el servicio.
- **Pivotes:**
  - Si falla el pago: canal B2B2B, en marca blanca para agencias y MSSP.
  - Si las horas superan 6 h/mes: auditoría más formación, sin operación continua.
  - Si el dolor real es IA y no n8n: revisión de agentes y MCP.
  - Si nada valida: parar.

**Incoherencia detectada:** el modelo de F10 no incluye la auditoría express de F11 (690–990 €) como producto de entrada. Solo contempla setups de 1.200–2.500 €. Hay que reconciliarlos tras los pilotos (pendiente).

---

## 13. Registro consolidado de riesgos

66 riesgos en la hoja `Riesgos`. La puntuación es Probabilidad × Impacto en escala 1–5, convertida desde las valoraciones cualitativas de cada fase (D48). R1–R9 quedan sin puntuar porque F01 y F02 no dieron base para ello. Estos son los principales:

| Riesgo | P×I | Fases | Mitigación |
|---|---|---|---|
| CVE críticos de n8n sin parchear en instancias de clientes (R39) | 20 | F08 | Rama stable, ≤72 h para críticos, n8n no expuesto |
| Baja disposición a pagar: 46 % <500 €/año, no verificado (R21, R47, R55, R61) | 16 | F05, F09, F10, F11 | Auditoría barata como entrada; pilotos pagados |
| Captación inferior a la prevista sin canal verificado (R54) | 16 | F10 | Canal de agencias n8n; 20 entrevistas antes de comprometerse |
| Capacidad de un operador / SLA 24x7 inasumible (R24, R44) | 16 | F05, F08 | SLA laboral; límite de clientes; socio por encima de 20–25 |
| n8n incorpora funciones de seguridad o las baja de Enterprise (R10, R53) | 16 / 12 | F03, F09 | Valor en la operación, no en funciones |
| Compresión de precios por pentest con IA (R16) | 16 | F04 | No vender pentest genérico |
| Tokens OAuth de larga vida con scopes amplios (R31) | 16 | F06 | M3, RFC 9700 |
| Pérdida de N8N_ENCRYPTION_KEY (R40) | 15 | F08 | Custodia separada; prueba de restauración T8 |
| Brecha de credenciales custodiadas por el proveedor (R34) | 15 | F07 | Programa de seguridad propio, RC y ciber, mínimo acceso |
| Licencia de n8n si se ofrece hosting (R32, R50, R64) | 12 | F07, F09, F11 | Solo en la instancia del cliente; consultar a n8n |
| Responsabilidad penal en pruebas (R33) | 10 | F07 | Carta de autorización y permiso del SaaS |
| NIS2 retrasada / usada sin base legal (R36, R49) | 12 / 9 | F07, F09 | Argumentar con la cadena de suministro y el RGPD |

---

## 14. Qué está verificado y qué es hipótesis

- **Verificado:**
  - CVE de n8n y cadencia de parches.
  - Funciones solo Enterprise (External Secrets, Log Streaming).
  - Precios de lista de herramientas e infraestructura.
  - Precios "desde" de MSSP españoles.
  - Universo de pymes (Cifras PYME, vía fuente secundaria).
  - Porcentajes del INE.
  - Disolución de las Cortes (RD 806/2026).
  - FAQ de la licencia de n8n.
  - Docs de arquitectura de n8n.
  - RFC 9700 y especificación MCP.
- **Estimación:**
  - Rangos de pentest y auditoría en España.
  - Exposición de instancias (26,5 k–105,7 k).
  - Horas de operación.
  - Coste de infraestructura por cliente.
  - SAM y SOM.
- **Hipótesis:**
  - Toda la demanda.
  - Todos los precios propios.
  - Conversión, churn y CAC.
  - Puntuaciones de segmentos.
  - Umbrales go/no-go.
  - Coste del seguro.
- **No verificado:**
  - Encuesta del 46 %.
  - Caducidad formal de la ley NIS2 en congreso.es.
  - Estado del DPF.
  - Supuesta brecha de n8n de agosto de 2026 (F03-S029; no usar).
  - Precio de Infisical (18/20/23 USD).
  - Si n8n Business incluye External Secrets.

---

## 15. Contradicciones entre fases y cómo se resolvieron

| # | Contradicción | Resolución |
|---|---|---|
| 1 | NIS2: F01 decía "no transpuesta; estado posterior al 22/09/2026 no verificado"; F07 dice "las Cortes se disolvieron y la iniciativa decae" | Compatibles; prevalece F07 por ser posterior y apoyarse en el BOE (F07-S005). La caducidad formal sigue sin verificar en congreso.es |
| 2 | Exposición de n8n: 105.753 IPs (Shadowserver) frente a 26.512 hosts (Censys) | Diferencia metodológica; se usa como rango, nunca como cifra única |
| 3 | Precios en USD (herramientas) y en EUR (servicios ES, VPS) | Sin conversión (D49); comparar solo dentro de la misma moneda |
| 4 | Huntress 8,99 USD: "hecho verificado" en F03 (página propia) y "estimación" en F04 (vía agregador) | Prevalece F03 (fuente primaria) |
| 5 | Infisical Pro: 18, 20 o 23 USD por identidad | Sin resolver; se mantiene como rango 18–23 y estimación |
| 6 | n8n Business (800 USD/mes) frente a la doc, que dice "External Secrets y Log Streaming solo en self-hosted Enterprise" | Sin resolver (F06_PENDIENTES); a efectos de diseño se asume que Community y Business no los tienen |
| 7 | SLA de parches críticos: F08 ≤72 h (≤24 h sin autenticación); F11 ≤2 días hábiles | Se adopta F11 como compromiso contractual (laboral) y F08 como objetivo interno |
| 8 | Precio alto de F05 (12.000 €/año) frente a la cuota máxima de F10 (550 €/mes) | Prevalece F10; el SAM en valor alto es un techo teórico |
| 9 | Auditoría express de F11 (690–990 €) ausente del modelo de F10 | Pendiente de reconciliar tras los pilotos |
| 10 | Horas recurrentes: F08 2–4 h/mes, F10 2,5–4 h, umbral de F11 ≤6 h | Coherentes; el ≤6 h es el límite de viabilidad, no la estimación |
| 11 | Segmentos A–E de F01 frente a S1–S10 de F09; F05 dio puntuaciones parciales para A | Se sustituyen por los 10 de F09 en el Excel; las puntuaciones parciales de F05 no se cargan |

---

## 16. Principales preguntas abiertas

1. ¿Pagan las pymes con n8n en producción ≥1.500 €/año por esto? Hacen falta 20 entrevistas y pilotos pagados.
2. ¿Aceptan las agencias n8n el modelo de marca blanca o co-venta, o lo ven como competencia?
3. ¿Cuántas instancias n8n hay en España? Falta el dato; se puede aproximar con EASM sobre datos públicos de Censys o Shodan, sin pruebas activas.
4. ¿Confirma n8n por escrito el modelo de "gestión de seguridad en la instancia del cliente" y la operación del gateway junto a ella?
5. ¿Cuánto cuesta el seguro de RC profesional y ciber, y qué suma asegurada pedirán los clientes?
6. ¿Son reales las horas de operación (≤6 h/mes) con la cadencia de CVE de 2026?
7. ¿Existe la encuesta primaria del 46 % y qué muestra tiene?
8. ¿Qué ERPs y SaaS ibéricos (Holded, Odoo, A3) firman sus webhooks?
9. ¿Se reactiva la ley NIS2 tras las elecciones del 29/11/2026, y cuándo?

---

## 17. Próximos 30 días (recomendado)

| Semana | Acción | Entregable / criterio |
|---|---|---|
| 1 | Montar el laboratorio aislado (Docker Compose n8n + PostgreSQL + runners) y la checklist v1 a partir de la doc oficial | T1–T2 superadas |
| 1 | Escribir a license@n8n.io con el modelo concreto; pedir 3 cotizaciones de RC y ciber | Respuesta escrita y precios reales |
| 1–2 | Listar 30 agencias y consultoras n8n (directorio experts.n8n.io, meetups de Barcelona y Madrid) y 30 pymes candidatas | Lista de contactos con fuente |
| 2–4 | 10–12 primeras entrevistas Mom Test (F11 §7) | Notas codificadas: gasto previo, dolor, compromiso |
| 3 | Gateway HMAC + backup/restore en el laboratorio | T4–T8 superadas |
| 3–4 | Abogado TIC: contrato de encargo, carta de autorización, condiciones y tope de responsabilidad | Plantillas firmables |
| 4 | Ofrecer la auditoría express a precio real a los entrevistados con más dolor | ≥1 auditoría pagada; si 0 de 12, revisar la hipótesis antes de seguir |
| 4 | Verificar la encuesta del 46 % y la caducidad formal de NIS2 | Fuente primaria o descarte |

**No dejar un empleo ni invertir más que tiempo y unos pocos cientos de euros (seguro, abogado) antes del go/no-go de la semana 16.**
