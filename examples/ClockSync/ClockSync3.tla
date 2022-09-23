------------------------------ MODULE ClockSync3 ------------------------------
(*
 * Incremental TLA+ specification of the clock synchronization algorithm from:
 *
 * Hagit Attiya, Jennifer Welch. Distributed Computing. Wiley Interscience, 2004,
 * p. 147, Algorithm 20.
 *
 * Assumptions: timestamps are natural numbers, not reals.
 *
 * Version 3: Receiving messages
 * Version 2: Sending messages
 * Version 1: Setting up the clocks
 *)
EXTENDS Integers

CONSTANTS
    \* minimum message delay
    \* @type: Int;
    t_min,
    \* maximum message delay
    \* @type: Int;
    t_max

ASSUME(t_min >= 0 /\ t_max > t_min)

VARIABLES
    \* the reference clock, inaccessible to the processes
    \* @type: Int;
    time,
    \* hardware clock of a process
    \* @type: Str -> Int;
    hc,
    \* clock adjustment of a process
    \* @type: Str -> Int;
    adj,
    \* messages sent by the processes
    \* @type: Set([src: Str, ts: Int]);
    msgs,
    \* messages received by the processes
    \* @type: Str -> Set([src: Str, ts: Int]);
    rcvd,
    \* the control state of a process
    \* @type: Str -> Str;
    state

(***************************** DEFINITIONS *********************************)

\* we fix the set to contain two processes
Proc == { "p1", "p2" }

\* control states
State == { "init", "sent", "sync" }

\* the adjusted clock of process i
AC(i) == hc[i] + adj[i]

(*************************** INITIALIZATION ********************************)

\* Initialization
Init ==
  /\ time \in Nat
  /\ hc \in [ Proc -> Nat ]
  /\ adj = [ p \in Proc |-> 0 ]
  /\ state = [ p \in Proc |-> "init" ]
  /\ msgs = {}
  /\ rcvd = [ p \in Proc |-> {} ]

(******************************* ACTIONS ***********************************)

\* send the value of the hardware clock
SendMsg(p) ==
  /\ state[p] = "init"
  /\ msgs' = msgs \union { [ src |-> p, ts |-> hc[p] ] }
  /\ state' = [ state EXCEPT ![p] = "sent" ]
  /\ UNCHANGED <<time, hc, adj, rcvd>>

\* receive a message sent by another process
ReceiveMsg(p) ==
  /\ \E m \in msgs:
      /\ m \notin rcvd[p]
      \* the message cannot be received earlier than after t_min
      /\ hc[m.src] >= m.ts + t_min
      /\ rcvd' = [ rcvd EXCEPT ![p] = rcvd[p] \union { m } ]
  /\ UNCHANGED <<time, hc, msgs, adj, state>>

\* let the time flow
AdvanceClocks(delta) ==
  /\ delta > 0
  \* clocks can be advanced only if there is no pending message
  /\ \A m \in msgs:
        hc[m.src] + delta > t_max =>
            \A p \in Proc:
                m \in rcvd[m.src]
  \* clocks are advanced uniformly
  /\ time' = time + delta
  /\ hc' = [ p \in Proc |-> hc[p] + delta ]
  /\ UNCHANGED <<adj, msgs, state, rcvd>>

\* all actions together
Next ==
  \/ \E delta \in Int:
      AdvanceClocks(delta)
  \/ \E p \in Proc:
      \/ SendMsg(p)
      \/ ReceiveMsg(p)

===============================================================================
