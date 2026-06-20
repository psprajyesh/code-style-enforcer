from parcle import Parcle

client = Parcle(api_key="pmem_FICHFySDlEU4YdcgPiEuiVZUkjDTNSiZslRJ7AtGbHE")

result = client.search(
    user_id="code-style-enforcer",
    query="What are our code style rules?"
)

print(result.answer)