import { jq } from "../../utils/service";
import { ASYNC, UPDATE } from "../../utils/store";

const reddits = ["ActionScript", "C", "Clojure", "CoffeeScript", "CSS", "Go", "Haskell", "HTML", "Java", "JavaScript", "Lua", "Matlab", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Scala", "Shell", "Swift", "TeX", "TypeScript", "Vim script"];
const orders = ["asc", "desc"];
const name = "async";

export default {
	name,
	state: {
		reddit: "JavaScript",
		order: "desc",
		reddits, orders,
		history: {
			"JavaScript|desc": {
				data: [],
				time: "",
				fetched: false,
				loading: false,
				// 没取数据
				// 没取数据 loading
				// 取过数据
				// 取过数据 loading
			},
		},
	},
	effects: {
		async GET_DATA({ payload }, { getState, dispatch }) {
			const { reddit, order, history } = {
				...getState()[name],
				...(payload || {}),
			};
			const key = `${reddit}|${order}`;
			const { loading, fetched } = history[key] || {};
			if (!reddit || !order || loading) {
				return;
			}
			dispatch({
				type: UPDATE,
				payload: { reddit, order },
				path: name,
			});
			if (payload && fetched) {
				return;
			}
			dispatch({
				type: UPDATE,
				payload: { loading: true },
				path: `${name}/history/${key}`,
			});
			dispatch({
				type: ASYNC,
				fn: () => jq({
					crossDomain: true,
					url: "https://api.github.com/search/repositories",
					data: {
						sort: "stars", order,
						q: `topic:${reddit} language:${reddit}`,
					},
				}),
				prefix: `${name}/REDDIT`,
				lock: `${name}/REDDIT_${key}`,
			});
		},
		async REDDIT_RES({ payload, action }, { dispatch }) {
			const { lock, prefix } = action;
			const key = lock.slice(prefix.length + 1);
			const { items } = payload || {};
			dispatch({
				type: UPDATE,
				payload: {
					fetched: true,
					loading: false,
					data: items || [],
					time: new Date().toLocaleString(),
				},
				path: `${name}/history/${key}`,
			});
		},
	},
	after: ({ dispatch }) => dispatch({ type: `${name}/GET_DATA` }),
};