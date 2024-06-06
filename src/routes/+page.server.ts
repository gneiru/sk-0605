import { Client, cacheExchange, fetchExchange } from '@urql/core';
import type { PageServerLoad } from './$types';
import { graphql } from '$lib/graphql/anilist';

const query = graphql(`
	query MediaListCollection($username: String!, $type: MediaType!) {
		MediaListCollection(userName: $username, type: $type) {
			lists {
				entries {
					updatedAt
					status
					id
					progress
					media {
						id
						coverImage {
							extraLarge
						}
						title {
							userPreferred
							english
						}
					}
				}
			}
		}
	}
`);

const client = new Client({
	url: 'https://graphql.anilist.co',
	exchanges: [fetchExchange, cacheExchange]
});

export const load: PageServerLoad = async () => {
	const response = client.query(query, {
		username: 'nrohi',
		type: 'MANGA'
	});

	const { data } = await response.toPromise();
	return {
		entries: data?.MediaListCollection?.lists
	};
};
