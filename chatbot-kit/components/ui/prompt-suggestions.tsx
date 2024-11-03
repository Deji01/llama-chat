interface PromptSuggestionsProps {
  label: string
  append: (message: { role: "user"; content: string }) => void
  suggestions: string[]
}

export function PromptSuggestions({
  label,
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold">{label}</h2>
      <div className="flex gap-6 text-sm md:text-base">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => append({ role: "user", content: suggestion })}
            className="flex-1 h-24 rounded-xl border border-gray-300 bg-background p-4 hover:bg-muted shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
          >
            <p className="text-center font-medium text-gray-700">{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
