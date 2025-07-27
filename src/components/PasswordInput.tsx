import {InputWithAdornments} from "@/components/InputWithAdornments.tsx";
import {Eye, EyeOff, Lock} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";

function PasswordInput(props: React.ComponentProps<typeof InputWithAdornments>) {
    const [visible, setVisible] = useState(false);

    return <InputWithAdornments
        type={visible ? "text" : "password"}
        startAdornment={<Lock size={20}/>}
        endAdornment={
            <Button type="button" variant="ghost" size="icon" onClick={() => setVisible(!visible)}>
                {visible ? <EyeOff/> : <Eye/>}
            </Button>
        }
        {...props}
    />
}

export {PasswordInput};
