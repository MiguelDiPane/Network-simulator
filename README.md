# Simulatore di Reti Watts-Strogatz

Una web app interattiva e performante progettata per visualizzare e analizzare la transizione verso le reti **"Small-World"** (Piccolo Mondo) utilizzando il modello di Watts-Strogatz.

## Modello Watts-Strogatz

Il modello Watts-Strogatz è un algoritmo di generazione di grafi casuali che produce reti con proprietà "Small-World". Queste reti sono caratterizzate da:
1.  **Alto Coefficiente di Clustering**: I nodi tendono a formare gruppi affiatati (clique).
2.  **Bassa Lunghezza Media del Percorso**: È possibile raggiungere qualsiasi nodo in pochi passaggi, nonostante l'alto clustering.

Questo simulatore permette di osservare come una rete passi da un **reticolo regolare** (ordinato) a una **rete casuale** (disordinata) aumentando la probabilità di ricollegamento ($\beta$).

## Funzionalità Principali

-   **Simulazione Interattiva**: Regola il numero di nodi ($N$), il grado medio ($K$) e la probabilità di ricollegamento ($\beta$) in tempo reale.
-   **Visualizzazione Dinamica**: Rendering fluido della rete grazie a **Cytoscape.js**, con layout ottimizzati per la leggibilità.
-   **Metriche in Tempo Reale**: Calcolo istantaneo del Coefficiente di Clustering e della Lunghezza Media del Percorso.
-   **Modalità Step-by-Step**: Osserva ogni singola operazione di "rewiring" con un log dettagliato delle modifiche strutturali.
-   **Log delle Attività**: Tracciamento completo di ogni arco eliminato e creato durante la simulazione.
-   **Interfaccia Moderna**: Design "Dark Mode" elegante, reattivo e ottimizzato per la produttività.

## Come Iniziare

1.  **Configurazione**: Usa gli slider nella barra laterale sinistra per impostare i parametri della rete.
2.  **Visualizzazione Iniziale**: L'app carica automaticamente un reticolo regolare circolare.
3.  **Simulazione**:
    *   Clicca su **"FULL SIMULATION"** per eseguire l'intero algoritmo istantaneamente.
    *   Clicca su **"STEP MODE"** per procedere un ricollegamento alla volta e studiare l'evoluzione della topologia.
4.  **Analisi**: Monitora i grafici e le metriche globali in alto a sinistra per vedere come la rete diventa "Small-World".

