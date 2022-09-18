const langBlockRuleResource = (query, resource) =>
  `${resource}.${query.get("lang")}`;

class VueLoaderPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    const rules = compiler.options.module.rules;

    const vueRule = rules.find((rule) => {
      return "foo.vue".match(rule.test);
    });

    // for each user rule (except the vue rule), create a cloned rule
    // that targets the corresponding language blocks in *.vue files.
    const clonedRules = rules
      .filter((r) => r !== vueRule)
      .map((rule) => cloneRule(rule, langBlockRuleResource));

    // console.log(`clonedRules`);
    // console.log(
    //   clonedRules
    // );
    // console.log(`clonedRules`);

    const pitcher = {
      loader: require.resolve("./pitcher"),
      resourceQuery: (query) => {
        // `?vue&type=script`
        // console.log('命中了吗🎯', ' ##' + query + '##')
        if (!query) return false;
        let parsed = new URLSearchParams(query.slice(1));
        return parsed.get("vue") !== null;
      },
    };

    const templateCompilerRule = {
      loader: require.resolve("./templateLoader"),
      resourceQuery: (query) => {
        if (!query) return false;
        let parsed = new URLSearchParams(query.slice(1));
        return parsed.get("vue") !== null && parsed.get("type") === "template";
      },
    };

    // console.log(`被截断了`)
    compiler.options.module.rules = [
      pitcher,
      templateCompilerRule,
      ...clonedRules,
      ...rules,
    ];

    // console.log(`修改 webpack 配置文件中的规则`)
    // console.log([
    //     pitcher,
    //     templateCompilerRule,
    //     ...clonedRules,
    //     ...rules,
    //   ])
    // console.log(`修改 webpack 配置文件中的规则`)
  }
}


function cloneRule(rule, ruleResource) {
  let currentResource;
  const res = Object.assign(Object.assign({}, rule), {
    resource: (resource) => {
      currentResource = resource;
      return true;
    },
    resourceQuery: (query) => {
      if (!query) {
        return false;
      }
      const parsed = new URLSearchParams(query.slice(1));
      if (parsed.get("vue") == null) {
        return false;
      }
      //取出路径中的lang参数，生成一个虚拟路径，传入规则中判断是否满足
      //通过这种方式，vue-loader可以为不同的区块匹配rule规则
      const fakeResourcePath = ruleResource(parsed, currentResource);
      console.log(1234567)
      console.log(query, fakeResourcePath, rule.test);
      console.log(1234567)
      if (!fakeResourcePath.match(rule.test)) {
        return false;
      }
      return true;
    },
  });
  delete res.test;
  return res;
}

module.exports = {
  VueLoaderPlugin,
};

// var rules = [
//   {
//     test: /\.vue$/,
//   },
//   {
//     test: /\.vue$/,
//   },
//   {
//     test: /\.vue$/,
//   },
// ];

// var vueRule = rules.find((rule) => "foo.vue".match(rule.test));
