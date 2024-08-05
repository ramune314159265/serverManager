import * as wanakana from 'wanakana'

export const convertToHiragana = (content: string): string => {
	return wanakana.toHiragana(content, {
		IMEMode: true,
		customKanaMapping: {
			kk: 'っ',
			ss: 'っ',
			tt: 'っ',
			hh: 'っ',
			mm: 'っ',
			yy: 'っ',
			rr: 'っ',
			gg: 'っ',
			zz: 'っ',
			dd: 'っ',
			bb: 'っ',
			pp: 'っ',
			cc: 'っ',
			ff: 'っ',
			jj: 'っ',
		}
	})
}

export const isRomaji = (content: string): boolean => {
	return wanakana.isRomaji(content)
}
