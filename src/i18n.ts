export type Language = 'zh' | 'en';

export const i18n = {
  zh: {
    app: {
      title: "LIFE OS",
      subtitle: "动态人生模拟器 & 行为反馈系统",
      intro: "选择决定路径，路径影响属性，属性决定未来事件。即将启动身份重建、目标重建、行为重建协议。",
      enter: "[ ENTER_SYSTEM ]",
      next: "[ NEXT_PHASE ]",
      init: "[ INITIALIZE_SYSTEM ]",
      start: "[ START_SIMULATION ]",
      processing: "正在处理...",
      p1: "> 编译 8 项核心属性...",
      p2: "> 生成身份标签...",
      p3: "> 初始化恐惧引擎...",
      p4: "> 校准心智等级...",
      p5: "> 系统就绪。",
    },
    onboarding: {
      m1: "模块 1: 身份引擎",
      q1: "A. 我现在是谁？(当前身份)",
      p_q1: "例如：一个拖延的打工人...",
      q2: "B. 我不想成为谁？(反面身份)",
      p_q2: "例如：平庸、抱怨、放弃自我的人...",
      q3: "C. 我想成为谁？(目标身份)",
      p_q3: "例如：自律的创造者...",
      m2: "模块 2: 恐惧引擎",
      m2_desc: "反愿景比愿景更重要。恐惧比梦想更驱动人。",
      q4: "我最害怕的人生是什么？(最坏情况)",
      p_q4: "描述你最恐惧的未来状态...",
      m3: "模块 3: 愿景引擎",
      m3_desc: "愿景 = 目标滤镜。系统将自动拆解你的目标。",
      q5: "三年后的人生 (主线任务)",
      p_q5: "例如：实现财务自由，成为行业专家...",
      q6: "一年后的人生 (首领任务)",
      p_q6: "例如：完成核心项目，收入翻倍...",
      q7: "一个月项目 (每日任务来源)",
      p_q7: "例如：上线第一个产品MVP...",
    },
    onboarding_chat: {
      intro: [
        "欢迎进入 LIFE OS。",
        "系统检测到你正在寻求改变。",
        "记住：身份决定行为，行为决定结果。如果你不主动构建你的身份，社会就会为你分配一个。",
        "现在，我们将通过 6 个核心问题，为你进行深度系统重置。准备好了吗？"
      ],
      ready_btn: "开始重置 [ START_RESET ]",
      groups: [
        {
          id: "pain",
          feedback: "疼痛是觉醒的第一步。逃避无法解决问题，直面它才是重构的开始。",
          questions: [
            {
              q: "1/6. 反愿景 (Anti-vision) – 什么是你存在的祸根，或者你绝对不想再经历的生活？",
              options: ["每天被无意义的工作填满，失去对时间的掌控", "深陷债务与财务焦虑，无法为自己和家人提供保障", "身体极度疲惫，精神内耗严重，失去所有活力", "周围都是充满抱怨和负能量的人，孤独且没有真实连接"]
            }
          ]
        },
        {
          id: "vision",
          feedback: "反愿景构建完毕。记住这种恐惧，它将是你最强大的燃料。现在，让我们把视线转向未来。",
          questions: [
            {
              q: "2/6. 愿景 (Vision) – 什么是你认为自己想要的理想生活，并且可以通过努力不断改善？",
              options: ["成为自由的创造者/创业者，拥有时间和地点的自由", "成为某个领域的顶尖专家，拥有不可替代的价值", "建立一个能够影响和帮助他人的系统或团队", "拥有极度健康的身心状态和深厚的人际关系"]
            },
            {
              q: "3/6. 一年目标 (1 year goal) – 一年后你的生活会是什么样子？它是否更接近你想要的生活？",
              options: ["核心项目上线并产生稳定收入，脱离生存焦虑", "完成关键技能的转型，进入理想的行业或岗位", "建立起雷打不动的自律习惯，身体和精神状态焕然一新", "还清债务，并拥有足够的抗风险储备金"]
            },
            {
              q: "4/6. 一个月项目 (1 month project) – 你需要学习什么？需要掌握什么技能？你能构建什么来让你更接近一年目标？",
              options: ["完成一个MVP（最小可行性产品）的开发和测试", "系统学习并掌握一项核心高收入技能（如编程、写作、销售）", "建立并严格执行一套个人知识管理和输出系统", "完成一次深度的行业调研并输出分析报告"]
            },
            {
              q: "5/6. 每日杠杆 (Daily levers) – 哪些是优先的、能产生实质性推动的任务，能让你的项目更接近完成？",
              options: ["每天清晨进行2小时无干扰的深度工作（Deep Work）", "每天坚持输出/创作至少500字或一段代码", "每天进行30分钟的高强度运动和冥想", "每天主动联系/跟进3个潜在客户或合作伙伴"]
            },
            {
              q: "6/6. 约束条件 (Constraints) – 为了从零开始实现你的愿景，你绝对不愿意牺牲什么？",
              options: ["我的健康和充足的睡眠时间", "与家人和重要的人相处的高质量时间", "我个人的核心价值观和道德底线", "我每天用于自我反思和学习的独立空间"]
            }
          ]
        }
      ],
      generating: "正在生成你的专属重构协议...",
      custom_input_placeholder: "或输入你的真实想法...",
      submit: "发送"
    },
    dashboard: {
      day: "天数",
      streak: "连续",
      diff: "难度",
      mind: "心智",
      exp: "经验",
      warning_title: "系统强制干预警告",
      warning_desc: "偏离度过高 ({dev}/100)。你正在迅速靠近你的反愿景。请立即调整行为模式！",
      id_engine: "[ 身份引擎 ]",
      cur_id: "当前身份",
      tar_id: "目标身份",
      fear_engine: "[ 恐惧引擎 ]",
      fear_quote: "\"反愿景 = 失败惩罚\"",
      deviation: "偏离度",
      action_engine: "[ 行动引擎 ]",
      daily_quests: "每日任务 (最多3个)",
      add_task: "输入今日核心任务...",
      no_quests: "暂无活跃任务",
      end_day: "[ 结束今日审计 ]",
      interrupt_engine: "[ 系统干预 ]",
      interrupt_desc: "打断无意识行为。随时唤醒自我。",
      trigger: "⚠️ 触发觉醒",
      vision_engine: "[ 愿景引擎 ]",
      main_quest: "主线任务 (3年)",
      boss_quest: "核心任务 (1年)",
      daily_source: "每日任务来源 (1个月)",
      daily_levers: "每日杠杆 (优先任务)",
      constraints: "约束条件 (底线)",
      evo_stats: "[ 进化数据 ]",
      history: "[ 数据库记录 ]",
      quest_lib: "[ 任务库 ]",
      self_reflect: "[ 行为自省 ]",
      tabs: {
        status: "状态",
        action: "行动",
        vision: "愿景"
      },
      system_active: "系统已激活",
      rebuild_os: "重构系统",
      core_module: "核心模块",
      threat_level: "威胁等级",
      execution_unit: "执行单元",
      manual_override: "手动干预",
      strategic_map: "战略地图",
      biometric_data: "生物识别数据",
      decision_point: "决策点",
      critical_event: "关键事件",
      data_stream: "数据流",
      id_hash: "身份哈希",
      evolution_path: "进化路径",
      access_granted: "访问授权",
      audit_init: "审计初始化",
      case_study: "案例研究",
      reward: "奖励",
      system_msg: "系统消息",
      neural_link: "神经连接: 已激活",
      buffer: "缓冲区",
      stats_radar: "属性雷达",
      level_label: "等级",
      rank_label: "阶位",
      life_progress: "生命进化进度",
      status_effects: "状态增益/减益",
      streak_bonus: "连胜加成",
      deviation_malus: "偏离惩罚",
      difficulty_easy: "简单",
      difficulty_normal: "普通",
      difficulty_hard: "困难",
      difficulty_extreme: "地狱"
    },
    stats: {
      identity: "身份",
      clarity: "清晰",
      focus: "专注",
      execution: "执行",
      creativity: "创造",
      health: "健康",
      wealth: "财富",
      influence: "影响"
    },
    modals: {
      mind_codex: "心智进化法典",
      current: "当前",
      life_choice: "人生抉择引擎",
      opt_a: "A. 选项一",
      opt_b: "B. 选项二",
      sys_interrupt: "系统干预",
      int_q: "你现在做这件事，是靠近愿景还是反愿景？",
      int_vision: "靠近愿景",
      int_fear: "靠近恐惧",
      int_escape: "我在逃避",
      feedback: "反馈闭环引擎",
      today_exec: "今日执行情况",
      no_tasks_warn: "未设定任何任务。执行力将大幅下降，偏离度将上升。",
      cancel: "取消",
      confirm: "确认审计",
      history_title: "进化数据库",
      no_history: "暂无记录",
      day_record: "第 {day} 天 - {date}",
      tasks: "任务",
      stats: "属性快照",
      quest_lib_title: "任务库",
      select_quest: "选择",
      manual_exp: "自定义任务默认获得 10 EXP",
      no_data: "暂无数据",
      self_reflect_title: "行为自省引擎",
      self_reflect_desc: "诚实是重构的第一步。记录你的负面行为，系统将扣除相应经验值并增加偏离度。",
      reflect_btn: "确认自省",
      exp_penalty: "EXP 惩罚"
    },
    toast: {
      max_tasks: "每日最多设定3个核心任务",
      int_v: "Focus +5, Deviation -5",
      int_f: "警告：正在接近反愿景！Deviation +10",
      int_e: "直面逃避。Execution -5, Deviation +5",
      attr_upd: "属性已更新",
      lvl_up: "LEVEL UP! 升级至：",
      day_end: "日结完成。获得 {exp} EXP"
    },
    quest_library: [
      { text: "深度工作 2 小时", exp: 20 },
      { text: "阅读 30 分钟", exp: 10 },
      { text: "健身 1 小时", exp: 15 },
      { text: "冥想 15 分钟", exp: 10 },
      { text: "复盘今日", exp: 5 },
      { text: "学习新技能 1 小时", exp: 15 },
      { text: "完成一个核心项目里程碑", exp: 30 },
      { text: "早起 (6:00前)", exp: 10 },
      { text: "拒绝一次无效社交", exp: 15 }
    ],
    debuff_library: [
      { text: "刷短视频超过 30 分钟", penalty: 15 },
      { text: "无意识刷社交媒体", penalty: 10 },
      { text: "暴饮暴食 / 情绪化进食", penalty: 20 },
      { text: "拖延核心任务", penalty: 15 },
      { text: "无意义熬夜 (超过 0:00)", penalty: 20 },
      { text: "过度游戏 / 娱乐", penalty: 15 },
      { text: "抱怨或传播负能量", penalty: 10 },
      { text: "冲动消费 / 乱花钱", penalty: 15 },
      { text: "逃避困难的沟通", penalty: 10 },
      { text: "久坐超过 2 小时未活动", penalty: 5 }
    ],
    mind_levels: [
      {
        level: 1,
        name: "冲动 (Impulsive)",
        description: "系统完全受底层本能和即时多巴胺反馈驱动。缺乏长期计算能力。",
        example: "案例：深夜无法控制地刷短视频；因为微小的挫折立刻放弃目标。"
      },
      {
        level: 2,
        name: "自我保护 (Self-Protective)",
        description: "防御机制过载。以自我为中心，将外界反馈视为威胁，推卸责任。",
        example: "案例：项目失败时，第一反应是寻找外部借口，而不是复盘自身执行力。"
      },
      {
        level: 3,
        name: "从众 (Conformist)",
        description: "运行外部植入的社会脚本。放弃独立运算，依赖群体共识来获得安全感。",
        example: "案例：因为“大家都在考研/考公”而随波逐流，从未思考过自己的真实愿景。"
      },
      {
        level: 4,
        name: "自我觉察 (Self-Aware)",
        description: "观测者模式启动。开始监控自身的行为模式和情绪波动，但控制权限仍不稳定。",
        example: "案例：意识到自己正在拖延，并能清晰地写下逃避的原因，开始尝试介入干预。"
      },
      {
        level: 5,
        name: "自觉尽责 (Conscientious)",
        description: "目标锁定与执行模块上线。能够设定长期目标，并依靠纪律性持续输出。",
        example: "案例：制定了严格的健身和学习计划，即使在没有动力的情况下也能依靠纪律完成。"
      },
      {
        level: 6,
        name: "个性自主 (Individualistic)",
        description: "重写底层代码。建立独立的价值评估体系，不再受外界评价干扰，追求真实自我。",
        example: "案例：拒绝了高薪但违背自身价值观的工作，选择了一条充满不确定性但热爱的人生路径。"
      },
      {
        level: 7,
        name: "策略谋划 (Strategist)",
        description: "多维系统思维。能够理解复杂系统的运作规律，处理模糊性和矛盾，制定降维打击策略。",
        example: "案例：在商业竞争中，不仅关注产品本身，更能洞察行业生态，通过重构规则来获取优势。"
      },
      {
        level: 8,
        name: "建构觉知 (Construct-Aware)",
        description: "打破虚拟现实。意识到所有社会规则、意义甚至“自我”都是一种建构，能够自由切换范式。",
        example: "案例：不再执着于任何单一的“成功学”或“信仰”，能根据当下情境自由调用不同的思维模型。"
      },
      {
        level: 9,
        name: "合一 (Unitive)",
        description: "系统与环境的边界消融。超越二元对立，达到绝对的平静、觉知与流动状态。",
        example: "案例：在面对人生的巨大无常时，依然保持内心的绝对澄明，与万物同频共振。"
      }
    ],
    events: [
      {
        id: 'e1',
        title: '职业分岔路',
        description: '一个高薪但极度消耗精力的工作机会出现了。这可能会打乱你当前的长期计划。',
        choiceA: { text: '接受挑战 (财富+15, 健康-10, 专注-5)', impact: { wealth: 15, health: -10, focus: -5 } },
        choiceB: { text: '拒绝，保持当前节奏 (健康+5, 财富-5, 执行+5)', impact: { health: 5, wealth: -5, execution: 5 } }
      },
      {
        id: 'e2',
        title: '社交诱惑',
        description: '老朋友邀请你参加一个周末的狂欢派对，但你原本计划推进你的核心项目。',
        choiceA: { text: '去参加派对 (影响力+10, 执行-10, 偏离度+15)', impact: { influence: 10, execution: -10, deviation: 15 } },
        choiceB: { text: '拒绝并专注项目 (执行+10, 专注+10, 影响力-5)', impact: { execution: 10, focus: 10, influence: -5, deviation: -10 } }
      },
      {
        id: 'e3',
        title: '健康危机预警',
        description: '连续的熬夜让你的身体发出了警告，今天感到极度疲惫。',
        choiceA: { text: '强行硬撑工作 (执行+5, 健康-20, 偏离度+10)', impact: { execution: 5, health: -20, deviation: 10 } },
        choiceB: { text: '彻底休息一天 (健康+15, 执行-10, 清晰度+5)', impact: { health: 15, execution: -10, clarity: 5 } }
      },
      {
        id: 'e4',
        title: '灵感爆发',
        description: '洗澡时突然想到了一个绝佳的创意，但实现它需要投入大量额外时间。',
        choiceA: { text: '立刻记录并开始探索 (创造力+20, 专注-10)', impact: { creativity: 20, focus: -10 } },
        choiceB: { text: '记在备忘录，按原计划执行 (执行+10, 创造力-5)', impact: { execution: 10, creativity: -5 } }
      }
    ]
  },
  en: {
    app: {
      title: "LIFE OS",
      subtitle: "Dynamic Life Simulator & Behavior Feedback System",
      intro: "Choices determine paths, paths affect attributes, attributes determine future events. Initiating identity, goal, and behavior reconstruction protocols.",
      enter: "[ ENTER_SYSTEM ]",
      next: "[ NEXT_PHASE ]",
      init: "[ INITIALIZE_SYSTEM ]",
      start: "[ START_SIMULATION ]",
      processing: "Processing...",
      p1: "> Compiling 8 Core Attributes...",
      p2: "> Generating Identity Tags...",
      p3: "> Initializing Fear Engine...",
      p4: "> Calibrating Mind Level...",
      p5: "> SYSTEM READY.",
    },
    onboarding: {
      m1: "Module 1: Identity Engine",
      q1: "A. Who am I now? (Current Identity)",
      p_q1: "e.g., A procrastinating worker...",
      q2: "B. Who do I NOT want to be? (Anti-Identity)",
      p_q2: "e.g., Mediocre, complaining, giving up...",
      q3: "C. Who do I want to be? (Target Identity)",
      p_q3: "e.g., A disciplined creator...",
      m2: "Module 2: Fear Engine",
      m2_desc: "Anti-vision is more important than vision. Fear drives people more than dreams.",
      q4: "What is the worst life I fear? (Worst Case Scenario)",
      p_q4: "Describe your most feared future state...",
      m3: "Module 3: Vision Engine",
      m3_desc: "Vision = Goal Filter. The system will automatically break down your goals.",
      q5: "Life in 3 years (Main Quest)",
      p_q5: "e.g., Achieve financial freedom, become an industry expert...",
      q6: "Life in 1 year (Boss Quest)",
      p_q6: "e.g., Complete core project, double income...",
      q7: "1-month project (Daily Quests Source)",
      p_q7: "e.g., Launch the first product MVP...",
    },
    onboarding_chat: {
      intro: [
        "Welcome to LIFE OS.",
        "The system detects that you are seeking change.",
        "Remember: Identity determines behavior, behavior determines results. If you don't actively construct your identity, society will assign one to you.",
        "Now, we will perform a deep system reset for you through 6 core questions. Are you ready?"
      ],
      ready_btn: "Start Reset [ START_RESET ]",
      groups: [
        {
          id: "pain",
          feedback: "Pain is the first step to awakening. Escaping won't solve problems; facing them is the beginning of reconstruction.",
          questions: [
            {
              q: "1/6. Anti-vision – What is the bane of your existence, or the life you never want to experience again?",
              options: ["Filled with meaningless work every day, losing control over my time", "Deep in debt and financial anxiety, unable to provide for myself and my family", "Extremely exhausted physically, severe mental friction, losing all vitality", "Surrounded by people full of complaints and negative energy, lonely with no real connections"]
            }
          ]
        },
        {
          id: "vision",
          feedback: "Anti-vision construction complete. Remember this fear; it will be your most powerful fuel. Now, let's turn our sights to the future.",
          questions: [
            {
              q: "2/6. Vision – What is the ideal life that you think you want and can improve as you work toward it?",
              options: ["Become a free creator/entrepreneur, with freedom of time and location", "Become a top expert in a certain field, with irreplaceable value", "Build a system or team capable of influencing and helping others", "Have an extremely healthy physical and mental state and deep interpersonal relationships"]
            },
            {
              q: "3/6. 1 year goal – What will your life look like in 1 year time, and is that closer to the life you want?",
              options: ["Core project launched and generating stable income, free from survival anxiety", "Completed transition of key skills, entering the ideal industry or position", "Established unshakable self-discipline habits, completely renewed physical and mental state", "Paid off debts and have sufficient risk-resistance reserves"]
            },
            {
              q: "4/6. 1 month project – What do you need to learn? What skills do you need to acquire? What can you build that will move you closer to the one year goal?",
              options: ["Develop and test an MVP (Minimum Viable Product)", "Systematically learn and master a core high-income skill (e.g., programming, writing, sales)", "Establish and strictly execute a personal knowledge management and output system", "Complete an in-depth industry research and output an analysis report"]
            },
            {
              q: "5/6. Daily levers – What are the priority, needle-moving tasks that bring your project closer to completion?",
              options: ["2 hours of uninterrupted Deep Work every morning", "Consistently output/create at least 500 words or a piece of code every day", "30 minutes of high-intensity exercise and meditation every day", "Proactively contact/follow up with 3 potential clients or partners every day"]
            },
            {
              q: "6/6. Constraints – What are you not willing to sacrifice to achieve your vision from the ground up?",
              options: ["My health and adequate sleep time", "High-quality time spent with family and significant others", "My personal core values and moral bottom line", "My independent space for self-reflection and learning every day"]
            }
          ]
        }
      ],
      generating: "Generating your exclusive reconstruction protocol...",
      custom_input_placeholder: "Or type your real thoughts...",
      submit: "Send"
    },
    dashboard: {
      day: "DAY",
      streak: "STREAK",
      diff: "DIFF",
      mind: "MIND",
      exp: "EXP",
      warning_title: "SYSTEM INTERVENTION WARNING",
      warning_desc: "Deviation too high ({dev}/100). You are rapidly approaching your anti-vision. Please adjust your behavior patterns immediately!",
      id_engine: "[IDENTITY_ENGINE]",
      cur_id: "Current Identity",
      tar_id: "Target Identity",
      fear_engine: "[FEAR_ENGINE]",
      fear_quote: "\"Anti-vision = Failure Penalty\"",
      deviation: "Deviation",
      action_engine: "[ACTION_ENGINE]",
      daily_quests: "Daily Quests (Max 3)",
      add_task: "Enter today's core quest...",
      no_quests: "NO ACTIVE QUESTS",
      end_day: "[ END_DAY_AUDIT ]",
      interrupt_engine: "[INTERRUPT_SYSTEM]",
      interrupt_desc: "Interrupt unconscious behavior. Awaken yourself at any time.",
      trigger: "⚠️ TRIGGER_AWAKENING",
      vision_engine: "[VISION_ENGINE]",
      main_quest: "Main Quest (3 Years)",
      boss_quest: "Boss Quest (1 Year)",
      daily_source: "Daily Quests Source (1 Month)",
      daily_levers: "Daily Levers (Priority Tasks)",
      constraints: "Constraints (Non-negotiables)",
      evo_stats: "[EVOLUTION_STATS]",
      history: "[ DATABASE_RECORDS ]",
      quest_lib: "[ QUEST_LIBRARY ]",
      self_reflect: "[ SELF_REFLECTION ]",
      tabs: {
        status: "Status",
        action: "Action",
        vision: "Vision"
      },
      system_active: "System Active",
      rebuild_os: "REBUILD_OS",
      core_module: "Core_Module",
      threat_level: "Threat_Level",
      execution_unit: "Execution_Unit",
      manual_override: "Manual_Override",
      strategic_map: "Strategic_Map",
      biometric_data: "Biometric_Data",
      decision_point: "Decision_Point",
      critical_event: "Critical_Event",
      data_stream: "Data_Stream",
      id_hash: "ID_HASH",
      evolution_path: "Evolution_Path",
      access_granted: "Access_Granted",
      audit_init: "Audit_Init",
      case_study: "Case_Study",
      reward: "Reward",
      system_msg: "System_Msg",
      neural_link: "Neural_Link: Active",
      buffer: "Buffer",
      stats_radar: "Stats",
      level_label: "Level",
      rank_label: "Rank",
      life_progress: "Evolution_Progress",
      status_effects: "Status_Effects",
      streak_bonus: "Streak_Bonus",
      deviation_malus: "Deviation_Malus",
      difficulty_easy: "Easy",
      difficulty_normal: "Normal",
      difficulty_hard: "Hard",
      difficulty_extreme: "Extreme"
    },
    stats: {
      identity: "Identity",
      clarity: "Clarity",
      focus: "Focus",
      execution: "Execution",
      creativity: "Creativity",
      health: "Health",
      wealth: "Wealth",
      influence: "Influence"
    },
    modals: {
      mind_codex: "MIND_EVOLUTION_CODEX",
      current: "CURRENT",
      life_choice: "LIFE_CHOICE_ENGINE",
      opt_a: "A. Option 1",
      opt_b: "B. Option 2",
      sys_interrupt: "SYSTEM_INTERRUPT",
      int_q: "Is what you are doing now moving you closer to your vision or your anti-vision?",
      int_vision: "Close to Vision",
      int_fear: "Approaching Fear",
      int_escape: "Escaping",
      feedback: "FEEDBACK_LOOP_ENGINE",
      today_exec: "Today's Execution",
      no_tasks_warn: "No quests set. Execution will drop significantly, and deviation will rise.",
      cancel: "CANCEL",
      confirm: "CONFIRM_AUDIT",
      history_title: "EVOLUTION_DATABASE",
      no_history: "No records found",
      day_record: "DAY {day} - {date}",
      tasks: "Tasks",
      stats: "Stats Snapshot",
      quest_lib_title: "QUEST_LIBRARY",
      select_quest: "SELECT",
      manual_exp: "Custom quests grant 10 EXP by default",
      no_data: "No data recorded.",
      self_reflect_title: "SELF_REFLECTION_ENGINE",
      self_reflect_desc: "Honesty is the first step to reconstruction. Record your negative behaviors; the system will deduct EXP and increase deviation.",
      reflect_btn: "CONFIRM_REFLECTION",
      exp_penalty: "EXP Penalty"
    },
    toast: {
      max_tasks: "Max 3 core quests per day",
      int_v: "Focus +5, Deviation -5",
      int_f: "WARNING: Approaching anti-vision! Deviation +10",
      int_e: "Facing escape. Execution -5, Deviation +5",
      attr_upd: "Attributes updated",
      lvl_up: "LEVEL UP! Advanced to: ",
      day_end: "Day audit complete. Gained {exp} EXP"
    },
    quest_library: [
      { text: "Deep Work 2h", exp: 20 },
      { text: "Read 30m", exp: 10 },
      { text: "Workout 1h", exp: 15 },
      { text: "Meditation 15m", exp: 10 },
      { text: "Daily Review", exp: 5 },
      { text: "Learn new skill 1h", exp: 15 },
      { text: "Complete a core project milestone", exp: 30 },
      { text: "Wake up early (before 6:00)", exp: 10 },
      { text: "Decline invalid socialization", exp: 15 }
    ],
    debuff_library: [
      { text: "Scrolling short videos > 30m", penalty: 15 },
      { text: "Mindless social media browsing", penalty: 10 },
      { text: "Binge eating / Emotional eating", penalty: 20 },
      { text: "Procrastinating on core tasks", penalty: 15 },
      { text: "Staying up late (past 0:00)", penalty: 20 },
      { text: "Excessive gaming / entertainment", penalty: 15 },
      { text: "Complaining or spreading negativity", penalty: 10 },
      { text: "Impulsive consumption", penalty: 15 },
      { text: "Avoiding difficult communication", penalty: 10 },
      { text: "Sedentary > 2h without movement", penalty: 5 }
    ],
    mind_levels: [
      {
        level: 1,
        name: "Impulsive",
        description: "System entirely driven by basic instincts and immediate dopamine feedback. Lacks long-term calculation capabilities.",
        example: "Case: Uncontrollably scrolling short videos late at night; giving up goals immediately due to minor setbacks."
      },
      {
        level: 2,
        name: "Self-Protective",
        description: "Defense mechanisms overloaded. Egocentric, views external feedback as threats, shifts blame.",
        example: "Case: When a project fails, the first reaction is to find external excuses rather than reviewing one's own execution."
      },
      {
        level: 3,
        name: "Conformist",
        description: "Running externally implanted social scripts. Abandons independent calculation, relies on group consensus for security.",
        example: "Case: Drifting along because 'everyone is taking exams/civil service', never thinking about one's true vision."
      },
      {
        level: 4,
        name: "Self-Aware",
        description: "Observer mode activated. Begins to monitor own behavior patterns and emotional fluctuations, but control authority remains unstable.",
        example: "Case: Realizes they are procrastinating and can clearly write down the reasons for escaping, attempting to intervene."
      },
      {
        level: 5,
        name: "Conscientious",
        description: "Goal locking and execution modules online. Able to set long-term goals and rely on discipline for sustained output.",
        example: "Case: Formulated a strict fitness and study plan, and can complete it relying on discipline even without motivation."
      },
      {
        level: 6,
        name: "Individualistic",
        description: "Rewriting underlying code. Establishes an independent value evaluation system, no longer disturbed by external judgments, pursues true self.",
        example: "Case: Refused a high-paying job that violated personal values, choosing an uncertain but passionate life path."
      },
      {
        level: 7,
        name: "Strategist",
        description: "Multi-dimensional systems thinking. Understands the operating laws of complex systems, handles ambiguity and contradiction, formulates dimensionality reduction strike strategies.",
        example: "Case: In business competition, focuses not only on the product itself but also insights into the industry ecology, gaining advantages by reconstructing rules."
      },
      {
        level: 8,
        name: "Construct-Aware",
        description: "Breaking virtual reality. Realizes all social rules, meanings, and even 'self' are constructs, able to switch paradigms freely.",
        example: "Case: No longer attached to any single 'successology' or 'belief', can freely invoke different mental models based on the current context."
      },
      {
        level: 9,
        name: "Unitive",
        description: "The boundary between system and environment dissolves. Transcends binary opposition, reaching a state of absolute peace, awareness, and flow.",
        example: "Case: Facing immense impermanence in life, still maintains absolute clarity within, resonating with all things."
      }
    ],
    events: [
      {
        id: 'e1',
        title: 'Career Crossroads',
        description: 'A high-paying but extremely draining job opportunity has appeared. This might disrupt your current long-term plans.',
        choiceA: { text: 'Accept the challenge (Wealth+15, Health-10, Focus-5)', impact: { wealth: 15, health: -10, focus: -5 } },
        choiceB: { text: 'Decline, maintain current pace (Health+5, Wealth-5, Execution+5)', impact: { health: 5, wealth: -5, execution: 5 } }
      },
      {
        id: 'e2',
        title: 'Social Temptation',
        description: 'An old friend invites you to a weekend party, but you originally planned to advance your core project.',
        choiceA: { text: 'Go to the party (Influence+10, Execution-10, Deviation+15)', impact: { influence: 10, execution: -10, deviation: 15 } },
        choiceB: { text: 'Decline and focus on project (Execution+10, Focus+10, Influence-5)', impact: { execution: 10, focus: 10, influence: -5, deviation: -10 } }
      },
      {
        id: 'e3',
        title: 'Health Crisis Warning',
        description: 'Continuous late nights have caused your body to issue a warning. You feel extremely exhausted today.',
        choiceA: { text: 'Force yourself to work (Execution+5, Health-20, Deviation+10)', impact: { execution: 5, health: -20, deviation: 10 } },
        choiceB: { text: 'Rest completely for a day (Health+15, Execution-10, Clarity+5)', impact: { health: 15, execution: -10, clarity: 5 } }
      },
      {
        id: 'e4',
        title: 'Inspiration Burst',
        description: 'While showering, you suddenly thought of a brilliant idea, but realizing it requires a massive amount of extra time.',
        choiceA: { text: 'Record immediately and start exploring (Creativity+20, Focus-10)', impact: { creativity: 20, focus: -10 } },
        choiceB: { text: 'Note it down, execute as planned (Execution+10, Creativity-5)', impact: { execution: 10, creativity: -5 } }
      }
    ]
  }
};
