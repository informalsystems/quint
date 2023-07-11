/// A Quint specification following Callum-A's cosmwasm-zero-to-hero tutorial:
/// https://github.com/Callum-A/cosmwasm-zero-to-hero
///
/// We refer to the relevant tutorial chapters in comments below.

module vote {

  /*** TYPES ***/

  // 05 - Contract state
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/05%20-%20State

  type Addr = str
  type UUID = str
  type Uint64 = int  // FIXME: account for under/overflows

  val None: Addr = ""

  type Config = {
    admin: Addr,
  }

  type Poll = {
    creator: Addr,
    question: str,
    options: List[(str, Uint64)]
  }

  type Ballot = {
    option: str
  }

  type ContractState = {
    config: Config,
    polls: UUID -> Poll,
    ballots: (Addr, UUID) -> Ballot
  }

  // 06 - Instantiate
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/06%20-%20Instantiate

  type MessageInfo = {
    sender: str
  }

  type InstantiateMsg = {
    admin: str
  }

  // 08 - ExecuteMsg
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/08%20-%20ExecuteMsg

  type CreatePoll = {
    poll_id: UUID,
    question: str,
    options: List[str]
  }

  type Vote = {
    poll_id: UUID,
    vote: str,
  }

  // 09 - Execute 1
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/09%20-%20Execute%201

  type Result = {
    error: str,
    cs: ContractState
  }

  // 12 - QueryMsg
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/12%20-%20QueryMsg

  type QueryAllPolls = {}
  type QueryPoll = { poll_id: str }
  type QueryVote = { poll_id: str, address: Addr }

  /*** Functional layer ***/

  // 06 - Instantiate
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/06%20-%20Instantiate

  def instantiate(cs: ContractState, info: MessageInfo,
                  msg: InstantiateMsg): ContractState = {
    val admin = if (msg.admin != None) msg.admin else info.sender
    // TODO: deps.api.addr_validate(&admin)?
    { ...cs, config: { admin: admin } }
  }

  // 09 - Execute 1
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/09%20-%20Execute%201

  def execute_create_poll(cs: ContractState, info: MessageInfo, poll_id: UUID,
                          question: str, options: List[str]): Result = {
    if (options.length() > 10) {
      { cs: cs, error: "TooManyOptions" }
    } else {
      val opts = options.foldl([], (res, opt) => res.append((opt, 0)))

      val poll = {
        creator: info.sender,
        question: question,
        options: opts
      }
      
      // CosmWasm: POLLS.save(deps.storage, poll_id, &poll)?;
      { cs: { ...cs, polls: cs.polls.put(poll_id, poll) }, error: "" }
    }
  }

  // 10 - Execute 2
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/10%20-%20Execute%202

  def execute_vote(cs: ContractState, info: MessageInfo, poll_id: UUID,
                   vote: str): Result = {
    // CosmWasm: POLLS.may_load(deps.storage, poll_id.clone())?;
    if (not(cs.polls.keys().contains(poll_id))) {
      // no such poll
      { cs: cs, error: "Unauthorized" }
    } else {
      val poll = cs.polls.get(poll_id)
      val _key = (info.sender, poll_id)

      val updated = if (not(cs.ballots.keys().contains(_key))) {
        // sender hasn't voted on this poll; simply add the ballot
        (poll.options, cs.ballots.put(_key, { option: vote }))
      } else {
        // sender already voted on the poll; adjust vote count for removing their old vote
        val ballot = cs.ballots.get(_key)
        val optionsDecr = poll.options.foldl([], (res, opt) => {
          // FIXME: in the original, this only adjusts the _first_ option in the list
          if (opt._1 == ballot.option) res.append((opt._1, opt._2 - 1)) else res.append(opt)
        })
        // update the ballot
        (optionsDecr, cs.ballots.set(_key, { option: vote }))
      }

      val updated_options = updated._1
      val updated_ballots = updated._2

      if (length(updated_options.select(opt => opt._1 == vote)) == 0) {
        { cs: cs, error: "Unauthorized" }
      } else {
        val optionsIncr = updated_options.foldl([], (res, opt) => {
          // FIXME: in the original, this only adjusts the _first_ option in the list
          if (opt._1 == vote) res.append((opt._1, opt._2 + 1)) else res.append(opt)
        })
        { cs: { ...cs, ballots: updated_ballots, polls: cs.polls.set(poll_id, { ...poll, options: optionsIncr }) }, error: ""}
      }
    }
  }

  // 13 - Query
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/13%20-%20Query

  def query_all_polls(cs: ContractState): List[Poll] = {
    cs.polls.keys().fold([], (res, poll_id) => res.append(cs.polls.get(poll_id)))
  }

  def query_poll(cs: ContractState, poll_id: UUID): List[Poll] = {
    cs.polls.keys().fold([], (res, pid) => {
      if (pid == poll_id) res.append(cs.polls.get(poll_id)) else res
    })
  }

  def query_vote(cs: ContractState, address: Addr, poll_id: UUID): List[Ballot] = {
    val _key = (address, poll_id)
    if (cs.ballots.keys().contains(_key)) {
      [ cs.ballots.get(_key) ]
    } else {
      []
    }
  }
}

/*** Tests ***/

module tests {
  import vote.*

  // 17 - Instantiate Test
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/07%20-%20Instantiate%20Test

  val ADDR1: Addr = "addr1"
  val ADDR2: Addr = "addr2"

  // To run:
  // quint test --main=tests --match=test_ vote.qnt
  run test_instantiate = {
    val _cs_init = { config: { admin: "__UNINIT__" }, polls: Map(), ballots: Map() }
    val info = { sender: ADDR1 }
    val msg_inst = { admin: None }
    val res = instantiate(_cs_init, info, msg_inst)
    assert(res.config.admin == ADDR1)
  }

  // 11 - Execute Tests
  // https://github.com/Callum-A/cosmwasm-zero-to-hero/tree/main/11%20-%20Execute%20Tests

  run test_execute_create_poll_valid = {
    val _cs_init = { config: { admin: "__UNINIT__" }, polls: Map(), ballots: Map() }
    val info = { sender: ADDR1 }
    val msg_inst = { admin: None }
    val _res_inst = instantiate(_cs_init, info, msg_inst)

    // New execute msg
    val msg_create = {
        poll_id: "some_id",
        question: "What's your favourite Cosmos coin?",
        options: [ "Cosmos Hub", "Juno", "Osmosis" ]
    }

    val _res_create = execute_create_poll(_res_inst, info, msg_create.poll_id,
                                          msg_create.question, msg_create.options)
    assert(_res_create.error == "")
  }

  run test_execute_create_poll_invalid = {
    val _cs_init = { config: { admin: "__UNINIT__" }, polls: Map(), ballots: Map() }
    val info = { sender: ADDR1 }
    val msg_inst = { admin: None }
    val _res_inst = instantiate(_cs_init, info, msg_inst)

    val msg_create = {
        poll_id: "some_id",
        question: "What's your favourite Cosmos coin?",
        options: [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11" ]
    }
    val _res_create = execute_create_poll(_res_inst, info, msg_create.poll_id,
                                          msg_create.question, msg_create.options)
    assert(_res_create.error != "")
  }

  run test_execute_vote_valid = {
    val _cs_init = { config: { admin: "__UNINIT__" }, polls: Map(), ballots: Map() }
    val info = { sender: ADDR1 }
    val msg_inst = { admin: None }
    val _res_inst = instantiate(_cs_init, info, msg_inst)

    // Create the poll
    val msg_create = {
        poll_id: "some_id",
        question: "What's your favourite Cosmos coin?",
        options: [ "Cosmos Hub", "Juno", "Osmosis" ]
    }
    val _res_create = execute_create_poll(_res_inst, info, msg_create.poll_id,
                                          msg_create.question, msg_create.options)

    // Create the vote, first time voting
    val msg1 = { poll_id: "some_id", vote: "Juno" }
    val _res_vote1 = execute_vote(_res_create.cs, info, msg1.poll_id, msg1.vote)

    // Change the vote
    val msg2 = { poll_id: "some_id", vote: "Osmosis" }
    val _res_vote2 = execute_vote(_res_vote1.cs, info, msg2.poll_id, msg2.vote)

    all {
      assert(_res_vote1.error == ""),
      assert(_res_vote2.error == "")
    }
  }

  run test_execute_vote_invalid = {
    val _cs_init = { config: { admin: "__UNINIT__" }, polls: Map(), ballots: Map() }
    val info = { sender: ADDR1 }
    val msg_inst = { admin: None }
    val _res_inst = instantiate(_cs_init, info, msg_inst)

    // Create the poll
    val msg_create = {
        poll_id: "some_id",
        question: "What's your favourite Cosmos coin?",
        options: [ "Cosmos Hub", "Juno", "Osmosis" ]
    }
    val _res_create = execute_create_poll(_res_inst, info, msg_create.poll_id,
                                          msg_create.question, msg_create.options)


    // Vote on a now existing poll but the option "DVPN" does not exist
    val msg = { poll_id: "some_id", vote: "DVPN" }
    val _res = execute_vote(_res_create.cs, info, msg.poll_id, msg.vote)
    assert(_res.error != "")
  }
}