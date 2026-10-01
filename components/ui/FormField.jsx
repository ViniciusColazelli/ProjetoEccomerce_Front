// components/ui/FormField.jsx
// Label + Input. O input fica dentro do label, então clicar no texto foca o campo.
import { T } from "styles/theme";
import Input from "./Input";

export default function FormField({ label, ...props }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ ...T.label, display: "block", marginBottom: 6 }}>
        {label}
      </span>
      <Input {...props} />
    </label>
  );
}
