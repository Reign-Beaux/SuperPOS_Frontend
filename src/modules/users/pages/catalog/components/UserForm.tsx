import { Button } from "@components/elements/button";
import { Input } from "@components/elements/input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateUserRequest } from "@modules/users/models/User";
import { type UserFormValues, userSchema } from "@modules/users/schemes/UserScheme";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRoleApi } from "@modules/roles/api/roleApi";
import type { Role } from "@modules/roles/models/Role";

interface UserFormProps {
  initialData?: UpdateUserRequest;
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm = ({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const { getAllRoles } = useRoleApi();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllRoles();
        if (response && Array.isArray(response)) {
          setRoles(response);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message !== "Request cancelled") {
          console.error("Failed to fetch roles", error);
        }
      }
    };

    fetchRoles();
  }, [getAllRoles]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      firstLastname: "",
      secondLastname: "",
      email: "",
      phone: "",
      roleId: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        firstLastname: initialData.firstLastname,
        secondLastname: initialData.secondLastname || "",
        email: initialData.email,
        phone: initialData.phone || "",
        roleId: initialData.roleId,
        confirmPassword: "",
      });
    } else {
      reset({
        name: "",
        firstLastname: "",
        secondLastname: "",
        email: "",
        phone: "",
        roleId: "",
        confirmPassword: "",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-5">
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Name
        </label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input {...field} placeholder="User Name" className={errors.name ? "border-red-500" : ""} />
          )}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          First Lastname
        </label>
        <Controller
          control={control}
          name="firstLastname"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="First Lastname"
              className={errors.firstLastname ? "border-red-500" : ""}
            />
          )}
        />
        {errors.firstLastname && <p className="text-sm text-red-500">{errors.firstLastname.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Second Lastname
        </label>
        <Controller
          control={control}
          name="secondLastname"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Second Lastname (Optional)"
              className={errors.secondLastname ? "border-red-500" : ""}
            />
          )}
        />
        {errors.secondLastname && <p className="text-sm text-red-500">{errors.secondLastname.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Email
        </label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input {...field} placeholder="Email" className={errors.email ? "border-red-500" : ""} />
          )}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Phone
        </label>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Phone (Optional)"
              className={errors.phone ? "border-red-500" : ""}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Role
        </label>
        <Controller
          control={control}
          name="roleId"
          render={({ field }) => (
            <div className="relative">
              <select
                {...field}
                className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.roleId ? "border-red-500" : ""}`}
              >
                <option value="" disabled>Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        />
        {errors.roleId && (
          <p className="text-sm text-red-500">{errors.roleId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Password {initialData ? "(Leave empty to keep current)" : "*"}
        </label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Confirm Password
        </label>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <div className="relative">
              <Input
                {...field}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}
        />
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          className="cursor-pointer"
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button className="cursor-pointer" type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};
