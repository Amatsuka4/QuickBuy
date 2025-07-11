// メールアドレスを短縮する関数
export default function shortenMailAddress(mailAddress: string): string {
	// メールアドレスをユーザー名とドメインに分割
	const [user, domain] = mailAddress.split("@");
	if (!user || !domain) return mailAddress;

	// ユーザー名が3文字以上の場合は短縮（最初と最後の文字のみ表示）
	const shortUser = user.length > 2 ? user[0] + "***" + user[user.length - 1] : user;
	const result = `${shortUser}@${domain}`;

	// 22文字未満の場合は短縮不要
	if (result.length < 22) return result;

	// ドメインをドメイン名とTLDに分割
	const [domainName, ...tld] = domain.split(".");
	if (!tld.length) return result;

	// ドメイン名が3文字以上の場合は短縮
	const shortDomain = domainName.length > 2 ? domainName[0] + "***" + domainName[domainName.length - 1] : domainName;
	return `${shortUser}@${shortDomain}.${tld.join(".")}`;
}