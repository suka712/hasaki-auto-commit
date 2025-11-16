# Hasaki auto-commit
This app automatically stage your changes and commit them with a message written by AI - Gemini Flash currently.

To run it,
```bash
git clone https://github.com/suka712/hasaki-auto-commit.git

cd hasaki-auto-commit

npm install

npm link
```
Make a `secret.ts` similar to `secret.example.ts` and put your Gemini API key in:
```ts
export const apiKey = 'AIzaSyCnTgTRwdd5tjgMO3eW3sASBsrxcJv1_gs';
```

The app should then be available via `hx`

```ts
/hasaki-auto-commit ❯ hx
Files changed: index.ts
Commit message: Rename generateMessage, add error handling.
[master 5769fc7] Rename generateMessage, add error handling.
1 file changed, 12 insertions(+), 8 deletions(-)

/hasaki-auto-commit ❯ hx
Files changed: index.ts
Commit message: Prevent auto-commit if no files changed.
[master b6e19b1] Prevent auto-commit if no files changed.
1 file changed, 6 insertions(+), 7 deletions(-)
```