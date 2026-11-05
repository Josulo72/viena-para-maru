# Seguridad de integraciones SaaS/CRM/ERP e identidad/secretos (estado a finales de 2026)

Fecha de acceso para todas las fuentes: 2026-11-05. Etiquetas de confianza: [VERIFICADO] = se leyó en fuente primaria/oficial en esta sesión; [ESTIMACIÓN]; [HIPÓTESIS]; [NO VERIFICADO] = de memoria o de un tercero, no comprobado en fuente primaria en esta sesión.
Método: 8 búsquedas/lecturas (Firecrawl). Solo se leyó una página completa (GTIG); el resto son extractos de buscador, lo que limita la confianza.

## Incidentes documentados de abuso de tokens OAuth/integración

### Takeaway
El patrón dominante en 2023-2025 no es el exploit de la plataforma SaaS, sino el robo/reutilización de tokens OAuth de apps conectadas de terceros (Drift, Gainsight) o de una app OAuth sobreprivilegiada (Microsoft). En todos los casos los proveedores declararon que no había vulnerabilidad en su plataforma: el riesgo vive en la capa de integración.

### Cited Findings
- **Salesloft Drift / Salesforce (UNC6395)**. GTIG + Mandiant, publicado 2025-08-26: desde al menos el 8 ago 2025 hasta al menos el 18 ago 2025 el actor accedió a instancias Salesforce de clientes con tokens OAuth comprometidos de la app de terceros Salesloft Drift; exfiltró datos de "numerosas" instancias corporativas y buscó secretos dentro de los datos (claves AWS "AKIA", contraseñas, tokens de Snowflake). No da cifra de organizaciones afectadas. [VERIFICADO] — [GTIG](https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift)
- Actualización GTIG (28 ago 2025): también se comprometieron tokens de la integración "Drift Email"; el 9 ago 2025 se accedió al correo de "un número muy pequeño" de cuentas de Google Workspace configuradas con Drift; Google revocó los tokens y deshabilitó la integración Workspace–Drift. [VERIFICADO] — [GTIG](https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift)
- Recomendaciones GTIG (útiles como lista de controles): tratar como comprometidos todos los tokens conectados a Drift; revocar y rotar credenciales; buscar secretos dentro de los datos del CRM (p.ej. con Trufflehog); revisar Salesforce Event Monitoring y eventos UniqueQuery; restringir scopes de Connected Apps (evitar `full`); restricciones IP en la Connected App; Login IP Ranges; quitar "API Enabled" de perfiles y darlo solo vía Permission Set; ajustar timeouts de sesión. [VERIFICADO] — [GTIG](https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift)
- Salesloft y Salesforce revocaron todos los tokens OAuth de Drift el 20 ago 2025; AppOmni atribuye UNC6395 a un actor "evaluado como chino". [NO VERIFICADO en fuente primaria; la atribución no aparece en el extracto de GTIG leído] — [AppOmni](https://appomni.com/blog/drift-breach-salesforce-unc6395-saas-prevention/)
- **Gainsight / Salesforce (nov 2025)**. Aviso oficial Salesforce (original 24 nov 2025): actividad inusual en apps publicadas por Gainsight conectadas a Salesforce que "puede haber permitido acceso no autorizado" a datos de ciertos clientes; "sin indicación de vulnerabilidad en la plataforma Salesforce"; Salesforce revocó los tokens OAuth de Gainsight el 20 nov 2025 (la revocación no borra audit trails). [VERIFICADO vía extracto de la página oficial] — [Salesforce Help](https://help.salesforce.com/s/articleView?language=en_US&id=005229029&type=1)
- Versión de Gainsight: Salesforce les contactó el 19 nov 2025; el 20 nov Mandiant recibió un email de quien se identificó como actor con un fichero de 285 tokens OAuth de Salesforce asociados a la integración Gainsight; el 22 oct 2025 el actor validó ~250 tokens en bloque; uso contra orgs entre el 16 y el 19 nov 2025; Gainsight dice no tener evidencia (en un año de logs) de que los tokens salieran de sus sistemas. Tema: longevidad de tokens OAuth antiguos. [VERIFICADO como declaración del proveedor afectado, no independiente] — [Gainsight blog](https://www.gainsight.com/blog/how-we-accelerated-a-year-of-security-work-in-weeks/) (fecha de publicación no visible en extracto)
- FINRA emitió alerta; afirma acceso no autorizado entre el 23 oct y el 19 nov 2025. [VERIFICADO vía extracto] — [FINRA](https://www.finra.org/rules-guidance/guidance/cybersecurity-advisory-salesforce-gainsight). Un tercero afirma que algunos tokens databan de 2017 [NO VERIFICADO] — [nhimg.org](https://nhimg.org/gainsight-salesforce-oauth-breach-2025)
- **Microsoft / Midnight Blizzard (ene 2024)**. MSRC: desde finales de nov 2023 el actor usó password spray contra una cuenta de un tenant de prueba legacy no productivo; según Microsoft Security Blog (2024-01-25) usó aplicaciones OAuth maliciosas para autenticarse en Exchange Online y atacar correo corporativo. Lección: app OAuth heredada sobreprivilegiada + cuenta sin MFA. [VERIFICADO vía extractos de fuentes primarias] — [MSRC](https://www.microsoft.com/en-us/msrc/blog/2024/01/microsoft-actions-following-attack-by-nation-state-actor-midnight-blizzard); [Microsoft Security](https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack/)
- **Okta (oct 2023)**: robo de archivos HAR con tokens de sesión desde el sistema de soporte de Okta. [NO VERIFICADO en esta sesión — no se consultó la fuente primaria de Okta; confirmar en sec.okta.com antes de citar]

### Inferences
- Una pyme que conecta HubSpot/Salesforce/Workspace vía Zapier/Make/n8n replica la misma superficie a escala pequeña: tokens de larga vida con scopes amplios guardados en una plataforma tercera. [HIPÓTESIS razonada]
- Los datos del CRM contienen secretos (campos de notas/tickets con claves): escanear secretos dentro de los SaaS, no solo en código, es un control derivado directamente de GTIG. [INFERENCIA de fuente VERIFICADA]

### Gaps
- Número real de organizaciones afectadas por Drift y Gainsight: no encontrado en fuentes primarias leídas.
- No se verificaron incidentes publicados que involucren Odoo, Holded, Zapier o Make con abuso de tokens; resultado negativo (no buscado en profundidad).

## SSPM, ITDR y diferencia con un WAF

### Takeaway
SSPM = conectores por API a cada SaaS que evalúan configuración, accesos/identidades (incl. apps OAuth de terceros) y, cada vez más, amenazas dentro del SaaS. ITDR = detección y respuesta sobre la capa de identidad. Un WAF protege tráfico HTTP hacia aplicaciones propias y no ve tokens OAuth usados contra APIs de un SaaS de terceros.

### Cited Findings
- Definición: las herramientas SSPM se conectan a apps SaaS vía APIs del proveedor y comprueban configuración, quién accede a qué y actividad anómala; no es CASB (en ruta de red) ni CSPM (infraestructura IaaS). [ESTIMACIÓN: fuente secundaria] — [tech-insider.org, sept 2026](https://tech-insider.org/appomni-vs-obsidian-vs-crowdstrike-falcon-shield-sspm-2026/)
- AppOmni define SSPM como categoría centrada en la postura de seguridad de aplicaciones SaaS y no sustitutiva de otros elementos. [VERIFICADO como definición de vendedor] — [AppOmni](https://appomni.com/learn/saas-security-fundamentals/sspm/)
- Proveedores con web propia confirmada en resultados: AppOmni ([appomni.com](https://appomni.com/)), Obsidian Security ([obsidiansecurity.com](https://www.obsidiansecurity.com/)), Grip Security ([grip.security](https://www.grip.security/grip-vs-appomni)), Astrix Security ([astrix.security](https://astrix.security/learn/blog/salesforce-oauth-token-breach-gtig-advisory/)), Adaptive Shield (adquirido por CrowdStrike en 2024). [VERIFICADO existencia]
- Según fuente secundaria (sept 2026): CrowdStrike renombró Adaptive Shield a "Falcon Shield" (jul 2026); Obsidian levantó Serie D de 85 M$ a ~1.100 M$ de valoración (ago 2026); Obsidian tiene nivel gratuito hasta 1.000 usuarios; otros en shortlist: Nudge Security, Valence Security, Palo Alto Networks, Zscaler (Canonic), herramientas nativas de Microsoft. [NO VERIFICADO — una sola fuente secundaria, no confirmar precios ni cifras sin fuente primaria] — [tech-insider.org](https://tech-insider.org/appomni-vs-obsidian-vs-crowdstrike-falcon-shield-sspm-2026/)
- Grip se posiciona como descubrimiento de SaaS en sombra e identidades no humanas, frente a AppOmni (auditoría de configuración de apps críticas). [Posicionamiento de vendedor] — [Grip](https://www.grip.security/grip-vs-appomni)

### Inferences
- Subcategorías útiles para la taxonomía: (a) SSPM de configuración, (b) descubrimiento SaaS/shadow IT, (c) seguridad de identidades no humanas (NHI: tokens, API keys, service accounts), (d) ITDR/detección en SaaS. [INFERENCIA]
- WAF vs. SSPM/ITDR: el ataque Drift no pasó por ninguna web de la víctima; ocurrió API a API entre el actor y Salesforce, por lo que un WAF era irrelevante. [INFERENCIA de fuente VERIFICADA]
- La mayoría de SSPM se venden por cotización a empresas medianas/grandes; el encaje para microempresas es dudoso. [HIPÓTESIS]

### Gaps
- Definición de ITDR de Gartner/fuente neutral no recuperada en esta sesión. Precios: no verificados (no inventar).

## Buenas prácticas de secretos, API keys, rotación y scopes

### Takeaway
OWASP recomienda centralizar secretos, ciclo de vida (creación, rotación, revocación, expiración), mínimo privilegio, auditoría y detección de secretos filtrados. Los incidentes Drift/Gainsight muestran que el fallo práctico es la falta de expiración/rotación de tokens OAuth y scopes amplios.

### Cited Findings
- OWASP Secrets Management Cheat Sheet existe e incluye sección de Detección (tipos de secretos a detectar incluyen tokens de sesión). [VERIFICADO parcial: solo extracto] — [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- OWASP Session Management: tokens generados con CSPRNG con ≥128 bits de entropía (preferible ≥160). [VERIFICADO vía extracto] — [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- Controles concretos de Salesforce derivados del incidente (scopes no `full`, IP restrictions, API Enabled solo por Permission Set, timeouts) — ver GTIG arriba. [VERIFICADO]
- AppOmni (20 nov 2025) recomienda revisar scopes OAuth para mínimo privilegio y eliminar integraciones no usadas. [Vendedor] — [AppOmni](https://appomni.com/blog/salesforce-gainsight-unauthorized-access-security-advisory/)

### Inferences
- Checklist mínimo pyme: inventario de apps conectadas por SaaS; scopes mínimos; cuenta de integración dedicada (no admin personal); rotación/caducidad; gestor de secretos o vault de la plataforma de automatización; revocar al dar de baja proveedor/empleado. [INFERENCIA]

### Gaps
- NIST: no se recuperó documento concreto (p.ej. SP 800-63B, SP 800-57) en esta sesión; citar solo tras verificar.

## Brecha de backup/recuperación en SaaS (responsabilidad compartida)

### Takeaway
Microsoft recomienda explícitamente en su contrato que el cliente haga backups periódicos, incluso con apps de terceros. Salesforce ofrece producto de pago Backup & Recover; su "Data Recovery Service" se retiró en 2020 y se reinstauró en 2021 (según terceros).

### Cited Findings
- Microsoft Services Agreement: "We recommend that you regularly back up your content and data that you store on the services or store using third-party apps and services." [VERIFICADO vía citas textuales coincidentes en varias fuentes; no se leyó el contrato directamente] — [Microsoft Services Agreement](https://www.microsoft.com/en-us/servicesagreement); citado por [ConnectWise](https://www.connectwise.com/blog/third-party-microsoft-365-cloud-backup) y [Veeam](https://www.veeam.com/blog/office365-shared-responsibility-model.html)
- Microsoft documenta el modelo de responsabilidad compartida (Azure/Learn). — [Microsoft Learn](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)
- Salesforce comercializa "Backup & Recover". [VERIFICADO existencia] — [Salesforce](https://www.salesforce.com/platform/data-backup-recovery/)
- Salesforce retiró Data Recovery Service el 31 jul 2020 y lo reinstauró en marzo 2021. [NO VERIFICADO en fuente primaria; fuentes de vendedores de backup con interés comercial] — [Flosum](https://www.flosum.com/blog/salesforce-data-backup-recovery-strategy); [Spanning](https://www.spanning.com/blog/salesforce-data-recovery-service/)

### Inferences
- Los vendedores de backup (Veeam, AvePoint, Hornetsecurity, Odaseva, Spanning, Flosum) son competencia indirecta/complementaria en la capa de recuperación. [INFERENCIA]

### Gaps
- Declaración oficial de Google Workspace sobre backup y de HubSpot/Odoo/Holded: no verificadas.

## Logging y monitorización realistas para una pyme

### Takeaway
Los CRMs ofrecen logs, pero la profundidad depende del plan: HubSpot registra logins en todos los planes de pago (Starter+), pero funciones como el acceso de empleados de HubSpot solo en Enterprise; Salesforce Event Monitoring (necesario según GTIG para investigar) es, según conocimiento general, de pago adicional.

### Cited Findings
- HubSpot: audit log centralizado; "solo registra acciones de usuarios HubSpot"; logins registrados en Starter, Professional y Enterprise; el historial de acceso de empleados de HubSpot solo para Super Admins en Enterprise. [VERIFICADO vía extracto de KB oficial] — [HubSpot KB](https://knowledge.hubspot.com/account-management/view-and-export-account-activity-history)
- Salesforce: la revocación de tokens no borra audit trails; GTIG recomienda revisar Event Monitoring y UniqueQuery. [VERIFICADO] — [Salesforce Help](https://help.salesforce.com/s/articleView?language=en_US&id=005229029&type=1); [GTIG](https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift)

### Inferences
- Un "log de acciones de usuario" puede no registrar llamadas API de integraciones: una pyme debe verificar si el log cubre tokens de apps. [HIPÓTESIS basada en la frase de HubSpot]
- Monitorización mínima viable: alertas de nuevo login/país, nuevas apps OAuth concedidas (Workspace/M365 lo exponen en consola admin), exportaciones masivas, cambios de admin. [HIPÓTESIS]

### Gaps
- Salesforce Event Monitoring: licencia (Shield) no verificada en esta sesión. Odoo y Holded: disponibilidad de audit log no verificada (Odoo tiene módulos de auditoría comunitarios — NO VERIFICADO). Retención de logs de M365/Workspace por licencia: no verificada.

## Encaje de un "servicio modular de seguridad" frente a estas categorías

### Takeaway
Las categorías existentes (SSPM, NHI/OAuth security, ITDR, backup SaaS, gestores de secretos) se venden sobre todo a empresas con equipo de seguridad. Un servicio modular para pymes encajaría plausiblemente como capa de servicio (auditoría + hardening + monitorización ligera + backup) que usa controles nativos y herramientas de terceros, más que como competidor de producto. [HIPÓTESIS]

### Cited Findings
- Fuentes verificadas arriba muestran que los controles críticos de Drift eran nativos (scopes, IP, permisos, logs) — [GTIG](https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift).
- Existencia de oferta gratuita/entrada en SSPM (Obsidian, hasta 1.000 usuarios) [NO VERIFICADO] — [tech-insider.org](https://tech-insider.org/appomni-vs-obsidian-vs-crowdstrike-falcon-shield-sspm-2026/)

### Inferences (categorías, no lista exhaustiva)
- Competidores directos: MSSP/MSP con oferta SaaS/M365 hardening; consultoras de seguridad para pymes. [HIPÓTESIS]
- Indirectos: plataformas SSPM/NHI (AppOmni, Obsidian, Grip, Astrix, Falcon Shield, Nudge, Valence); herramientas nativas (Microsoft Defender for Cloud Apps, consola admin de Workspace). [INFERENCIA]
- Complementarios: backup SaaS (Veeam, AvePoint, Odaseva…), gestores de secretos (Akeyless, Infisical, HashiCorp Vault, 1Password), IdP/SSO. [INFERENCIA]
- Diferenciación plausible: cobertura de ERPs locales/ibéricos (Odoo, Holded) y de plataformas de automatización (Zapier/Make/n8n), poco cubiertos por SSPM grandes. [HIPÓTESIS — no verificada la cobertura de conectores de los SSPM]

### Gaps
- Cobertura real de Odoo/Holded/Zapier/Make en catálogos SSPM: no verificada. Precios de cualquier vendedor: no verificados.
