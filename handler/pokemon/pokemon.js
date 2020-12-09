const request = require('node-superfetch');
const path = require('path');
const { removeDuplicates, firstUpperCase } = require('../../util/util');
const missingno = require('../../assets/missingno');

module.exports = class Pokemon {
	constructor(store, data) {
		this.store = store;
		this.id = data.id;
		const slugName = firstUpperCase(data.name).split('-').join(' ');
		this.name = data.names.length
			? data.names.find(entry => entry.language.name === 'en').name
			: slugName;
		this.entries = removeDuplicates(data.flavor_text_entries
			.filter(entry => entry.language.name === 'en')
			.map(entry => entry.flavor_text.replace(/\n|\f|\r/g, ' ')));
		this.names = data.names.length
			? data.names.map(entry => ({ name: entry.name, language: entry.language.name }))
			: [{ name: slugName, language: 'en' }];
		this.genus = data.genera.length
			? `The ${data.genera.filter(entry => entry.language.name === 'en')[0].genus}`
			: 'Galar Native';
		this.varieties = data.varieties.map(variety => {
			const name = firstUpperCase(variety.pokemon.name
				.replace(new RegExp(`${this.slug}-?`, 'i'), '')
				.split('-').join(' '));
			return {
				id: variety.pokemon.name,
				name: name || null,
				default: variety.is_default,
				display: data.missingno ? true : null,
				types: data.missingno ? variety.types : []
			};
		});
		this.chain = {
			url: data.evolution_chain ? data.evolution_chain.url : null,
			data: data.missingno ? missingno.chain : data.evolution_chain ? [] : [data.id]
		};
		this.typesCached = data.missingno || false;
		this.missingno = data.missingno || false;
		this.cry = path.join(__dirname, '..', '..', 'assets', 'sounds', 'pokedex', `${data.id}.wav`);
	}

	get displayID() {
		if (this.missingno) return '???';
		return this.id.toString().padStart(3, '0');
	}

	get slug() {
		return this.store.makeSlug(this.name);
	}

	get spriteImageURL() {
		if (this.missingno) return missingno.sprite;
		return `https://serebii.net/pokemon/art/${this.displayID}.png`;
	}

	get boxImageURL() {
		if (this.missingno) return missingno.box;
		return `https://www.serebii.net/pokedex-swsh/icon/${this.displayID}.png`;
	}

	get serebiiURL() {
		if (this.missingno) return missingno.url;
		return `https://www.serebii.net/pokedex-swsh/${this.displayID}.shtml`;
	}

	async fetchTypes() {
		if (this.typesCached) return this;
		const defaultVariety = this.varieties.find(variety => variety.default);
		const { body: defaultBody } = await request.get(`https://pokeapi.co/api/v2/pokemon/${defaultVariety.id}`);
		defaultVariety.types.push(...defaultBody.types.map(type => firstUpperCase(type.type.name)));
		defaultVariety.display = true;
		for (const variety of this.varieties) {
			if (variety.id === defaultVariety.id) continue;
			const { body } = await request.get(`https://pokeapi.co/api/v2/pokemon/${variety.id}`);
			variety.types.push(...body.types.map(type => firstUpperCase(type.type.name)));
			if (variety.types[0] === defaultVariety.types[0] && variety.types[1] === defaultVariety.types[1]) {
				variety.display = false;
			} else {
				variety.display = true;
			}
		}
		this.typesCached = true;
		return this;
	}

	async fetchChain() {
		if (this.chain.data.length) return this.chain.data;
		const { body } = await request.get(this.chain.url);
		const basePkmn = await this.store.fetch(body.chain.species.name);
		this.chain.data.push(basePkmn.id);
		if (body.chain.evolves_to.length) {
			const evolution1 = body.chain.evolves_to;
			if (!evolution1) return this.chain.data;
			const evos1 = [];
			const evos2 = [];
			for (const evolution of evolution1) {
				const pkmn = await this.store.fetch(evolution.species.name);
				evos1.push(pkmn.id);
				if (evolution.evolves_to) {
					for (const evolution2 of evolution.evolves_to) {
						const pkmn2 = await this.store.fetch(evolution2.species.name);
						evos2.push(pkmn2.id);
					}
				}
			}
			this.chain.data.push(evos1.length === 1 ? evos1[0] : evos1);
			if (evos2.length) this.chain.data.push(evos2.length === 1 ? evos2[0] : evos2);
		}
		return this.chain.data;
	}
};
