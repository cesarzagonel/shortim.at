"use client";

import {
  Box,
  Button,
  Card,
  CardBody,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { otpLogin } from "@/server/otpLogin";

interface ConfirmForm {
  otp: string;
}

export default function ConfirmForm({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ConfirmForm>();

  const mutation = useMutation(async (data: ConfirmForm) => {
    const result = await otpLogin(id, data.otp);

    if ("error" in result === false) {
      router.push("/");
    }

    return result;
  });

  return (
    <Box
      flexGrow={1}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Card w={400}>
        <CardBody>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <Stack spacing={4}>
              <Text>
                We sent a one time code to <strong>{email}</strong>, please put
                it in the field below.
              </Text>

              <FormControl>
                <FormLabel>OTP</FormLabel>
                <Input
                  type="text"
                  {...register("otp", {
                    required: true,
                  })}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                rightIcon={
                  mutation.isLoading ? (
                    <CircularProgress
                      size={4}
                      isIndeterminate
                      color="orange.400"
                    />
                  ) : undefined
                }
              >
                Continue
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}