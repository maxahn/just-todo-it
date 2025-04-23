import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

interface TagProps {
  isActive: boolean;
  onPress: () => void;
  label: string;
}

export function Tag({ isActive, onPress, label }: TagProps) {
  return (
    <Pressable onPress={onPress}>
      <Box
        className={`rounded-full py-3 px-4 ${isActive ? "bg-primary-400" : "bg-background-50"}`}
      >
        <Text>{label}</Text>
      </Box>
    </Pressable>
  );
}
