import { useField } from "formik";
import { Textarea } from "@/components/ui/textarea";

interface BioInputProps {
  name: string;
  maxChars?: number;
}

export default function BioInput({ name, maxChars = 2500 }: BioInputProps) {
  const [field, meta, helpers] = useField(name);
  const { value } = field;
  const { setValue, setTouched } = helpers;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxChars) {
      setValue(newValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        id={name}
        {...field}
        rows={6}
        placeholder="Tell everyone something about yourself..."
        value={value || ""}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        maxLength={maxChars}
        className={`w-full ${
          meta.touched && meta.error ? "border-destructive" : ""
        }`}
      />
      <p
        className={`text-xs text-right ${
          (value?.length ?? 0) > maxChars * 0.9
            ? "text-destructive"
            : "text-muted-foreground"
        }`}
      >
        {value?.length ?? 0} / {maxChars} characters
      </p>
      {meta.touched && meta.error && (
        <p className="text-xs text-destructive">{meta.error}</p>
      )}
    </div>
  );
}
